declare module "react-rating-stars-component" {
  import type { ComponentType } from "react"

  export type ReactStarsProps = {
    count?: number
    value?: number
    size?: number
    char?: string
    isHalf?: boolean
    edit?: boolean
    activeColor?: string
    color?: string
    a11y?: boolean
    onChange?: (newValue: number) => void
    classNames?: string
  }

  const ReactStars: ComponentType<ReactStarsProps>
  export default ReactStars
}
