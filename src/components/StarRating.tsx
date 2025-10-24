import { AiFillStar, AiOutlineStar } from "react-icons/ai"

type StarRatingProps = {
  value?: number // 0..5
}

export function StarRating({ value = 5 }: StarRatingProps) {
  // biome-ignore lint/style/noMagicNumbers: ok
  const v = Math.max(0, Math.min(5, Math.round(value)))
  const stars = Array.from({ length: 5 }, (_, i) => i < v)
  return (
    <div className="flex gap-1.5">
      <span className="inline-flex text-[#FF859B]">
        {stars.map((filled, idx) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: ok
<span key={idx}>{filled ? <AiFillStar /> : <AiOutlineStar />}</span>
        ))}
      </span>
    </div>
  )
}
