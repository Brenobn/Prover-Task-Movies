import { AiFillStar } from "react-icons/ai"

export function StarRating() {
  return(
    <div className="flex gap-1.5">
      <span className="text-[#FF859B] inline-flex">
        <AiFillStar />
        <AiFillStar />
        <AiFillStar />
        <AiFillStar />
        <AiFillStar />
      </span>
    </div>
  )
}