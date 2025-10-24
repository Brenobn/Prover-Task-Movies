import ReactStars from "react-rating-stars-component"

type StarRatingProps = {
  value?: number // 0..5, aceita decimais
  size?: number
}

export function StarRating({ value = 0, size = 20 }: StarRatingProps) {
  return (
    <ReactStars
      count={5}
      value={value}
      size={size}
      isHalf
      edit={false}
      activeColor="#FF859B"
      color="#3E3B47"
      char="★"
      classNames="flex items-center gap-1 font-sans"
    />
  )
}
