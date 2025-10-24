import ReactStars from "react-rating-stars-component"

type StarRatingProps = {
  value?: number // 0..5, aceita decimais
  size?: number
  editable?: boolean
  allowHalf?: boolean
  onChange?: (newValue: number) => void
}

export function StarRating({
  value = 0,
  size = 20,
  editable = false,
  allowHalf = true,
  onChange,
}: StarRatingProps) {
  return (
    <ReactStars
      count={5}
      value={value}
      size={size}
      isHalf={allowHalf}
      edit={editable}
      activeColor="#FF859B"
      color="#3E3B47"
      char="★"
      classNames="flex items-center gap-1 font-sans"
      onChange={onChange}
    />
  )
}
