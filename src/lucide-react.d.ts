import { FC, SVGProps, ForwardRefExoticComponent, RefAttributes } from 'react'

type LucideIcon = ForwardRefExoticComponent<
  Omit<SVGProps<SVGSVGElement>, 'ref'> & RefAttributes<SVGSVGElement>
>

declare module 'lucide-react' {
  export const Play: LucideIcon
  export const Pause: LucideIcon
  export const Download: LucideIcon
  export const Headphones: LucideIcon
  export const Podcast: LucideIcon
  export const FileText: LucideIcon
  export const Clock: LucideIcon
  export const Sparkles: LucideIcon
  export const Newspaper: LucideIcon
  export const TrendingUp: LucideIcon
  export const BookOpen: LucideIcon
  export const Layers: LucideIcon
  export const ArrowDown: LucideIcon
  export const Film: LucideIcon
  export const ThumbsUp: LucideIcon
  export const ThumbsDown: LucideIcon
  export const Star: LucideIcon
  export const ArrowLeft: LucideIcon
  export const Calendar: LucideIcon
  export const Tag: LucideIcon
  export const BarChart3: LucideIcon
  export const Users: LucideIcon
  export const Eye: LucideIcon
  export const ExternalLink: LucideIcon
  export const Settings: LucideIcon
  export const Save: LucideIcon
  export const ArrowUp: LucideIcon
  export const Menu: LucideIcon
  export const X: LucideIcon
  export const Search: LucideIcon
  export const ChevronRight: LucideIcon
  export const ChevronLeft: LucideIcon
  export const Loader2: LucideIcon
  export const AlertCircle: LucideIcon
  export const Check: LucideIcon
  export const Info: LucideIcon
}
