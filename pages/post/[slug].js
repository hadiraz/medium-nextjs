import React, { useState } from 'react'
import Header from '../../components/Header';
import { sanityClient, urlFor } from '../../sanity';
import PortableText from 'react-portable-text';
import { useForm } from 'react-hook-form';
function Post({ post }) {
    const [submit , setSubmit] = useState(false);
    const [error , setError] = useState(false);
    console.log(post)
    const {register , handleSubmit , formState:{ errors }} = useForm() ;
    const onSubmit = async(data) => {
        await fetch("/api/createComment" , {
            method : "POST" ,
            body : JSON.stringify(data) ,
        })
        .then(()=>{ 
            setSubmit(true); 
            setError(false)})
        .catch(err => { 
            setSubmit(false) ;
            setError(true) 
        })
    }

  return (
    <div className=''>
        <Header/>
        <main className='max-w-7xl mx-auto'>
            <img className='w-full h-40 object-cover' src={urlFor(post.mainImage).url()} alt={post.title}/>
            <article className='max-w-3xl mx-auto p-5'>
                <h1 className='text-3xl mt-10 mb-3'>{post.title}</h1>
                <h2 className='text-xl font-light text-gray-500 mb-2'>{post.description}</h2>
                <div className='flex items-center'>
                    <img className='object-cover w-16 h-16 rounded-full mr-3' src={urlFor(post.author.image).url()} />
                    <div>
                        <p className='font-extralight text-sm'>Blog post by <span className='text-green-600'>{post.author.name}</span> - created at {new Date(post._createdAt).toLocaleString()}</p>
                    </div>
                </div>
                <div className='mt-5'>
                    <PortableText 
                    className=''
                    content={post.body} 
                    dataset= {process.env.NEXT_PUBLIC_SANITY_DATASET || "production"}
                    projectId= {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                    serializers = {{
                        h1 : props => (<h1 className='text-2xl font-bold my-5' {...props}/>) ,
                        h2 : props => (<h2 className='text-xl font-bold my-5' {...props}/>) ,
                        li : ({children}) => (<li className='ml-4 list-disc'>{children}</li>) ,
                        link : ({children , href}) => (<a href={href} className='text-blue-500 hover:underline'>{children}</a>) ,
                    }}
                    />
                </div>
            </article>
            <hr className='max-w-lg my-5 mx-auto border border-yellow-500' />
            <form className='flex flex-col max-w-2xl mx-auto p-5 mb-10' onSubmit={handleSubmit(onSubmit)}>

                {submit && 
                    <div className='bg-yellow-500 p-4 rounded mb-5'>
                        <h1 className='mb-1 font-bold text-white text-3xl'>Thanks for your feedback</h1>
                        <p className='text-white'>after approving, your message will be showing below.</p>
                    </div>
                }

                {error && 
                    <div className='bg-red-400 p-4 rounded mb-5'>
                        <p className='text-white'>An error occurred.</p>
                    </div>
                }

                <input {...register("_id")} name="_id" value={post._id} type="hidden" />
                <div className='flex flex-col mb-5 w-full'>
                    <label htmlFor='name' className='text-gray-700 mb-1'>name</label>
                    <input {...register("name" , { required : true })} className='shadow border rounded-lg py-2 px-3 form-input mt-1 outline-none focus:ring focus:ring-yellow-500 w-full' id="name" placeholder='hadi raziei' />
                </div>
                <div className='flex flex-col mb-5 w-full'>
                    <label htmlFor='email' className='text-gray-700 mb-1'>email</label>
                    <input {...register("email" , { required : true })} className='shadow border rounded-lg py-2 px-3 form-input mt-1 outline-none focus:ring focus:ring-yellow-500 w-full' id="email" placeholder='abc@something.com' />
                </div>
                <div className='flex flex-col mb-5 w-full'>
                    <label htmlFor='comment' className='text-gray-700 mb-1'>comment</label>
                    <textarea {...register("comment" , { required : true })}  className='shadow border rounded-lg py-2 px-3 form-textarea mt-1 focus:ring focus:ring-yellow-500 w-full outline-none' id="comment" placeholder='abc@something.com' rows={8}>

                    </textarea>
                </div>
                <div className='flex flex-col p-5'>
                    {
                        errors.name && <span className='text-red-500'>* name is required</span>
                    }
                    {
                        errors.comment && <span className='text-red-500'>* comment is required</span>
                    }
                    {
                        errors.email && <span className='text-red-500'>* email is required</span>
                    }
                </div>
                <button type='submit' className='bg-yellow-500 border-none outline-none hover:bg-yellow-400 transition transition-duration-200 rounded py-2 focus:shadow-outline text-white font-bold focus:shadow-outline'>submit</button>
            </form>
            <div className='flex flex-col max-w-2xl mx-auto p-5 mb-10 shadow rounded overflow-hidden shadow-yellow-300'>
                <h1 className='font-bold text-2xl'>Comments</h1>
                <hr className= ' w-full max-w-lg my-5 mx-auto border border-yellow-500' />
                {
                post.comments.length > 0 ? post.comments.map(value=>(
                    <p key={value._id}>
                        <span className='text-yellow-500'>{value.name}</span> : {value.comment}
                    </p>
                )) : "No comments yet"
                }
            </div>

        </main>
    </div>
  )
}

export default Post

export async function getStaticPaths(){
    const query = `*[_type == "post"]{
        _id, 
        slug{
            current
        } ,
        }` ;

    const posts = await sanityClient.fetch(query);

    const paths = posts.map(post => ({
        params : {
            slug : post.slug.current
        }
    }))

    return {
        paths,
        fallback : "blocking"
    }
}

export async function getStaticProps({params}){
    const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,

        slug{
            current
        } ,
        title,
        description,
        author -> {
            name ,
            image
        },
        'comments' : *[
            _type == "comment" && 
            post._ref == ^._id &&
            approved == true
        ],
        description,
        mainImage,
        slug,
        body
        }` ;

    const post = await sanityClient.fetch(query , {
        slug : params.slug ,
    });
    if(!post){
        return { notFound : true }
    }

    return {
        props : {
            post ,
            revalidate : 60
        }
    }
}