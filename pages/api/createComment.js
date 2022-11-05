import SanityClientConstructor from "@sanity/client";

export const config = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    useCdn: process.env.NODE_ENV === false,
    token : process.env.SANITY_API_TOKEN
  };
const client = SanityClientConstructor(config)
export default async function createComment(req , res) {
    const {_id , name , email , comment} = JSON.parse(req.body) ;
    try{
        await client.create({
           _type: 'comment',
            post: {
                _type: 'reference',
                _ref: _id,
            },
            name,
            email,
            comment
        })
    } catch (err) {
        return res.status(500).json({ message : "couldn't submit the comment" , err })
    }
    return res.status(200).json({ message : "comment submitted successfully" })
}
