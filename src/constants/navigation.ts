import CodepenIcon from '@/components/atoms/icons/social-icons/codepen-icon.astro'
import GithubIcon from '@/components/atoms/icons/social-icons/github-icon.astro'
import LinkedinIcon from '@/components/atoms/icons/social-icons/linkedin-icon.astro'
import WhatsappIcon from '@/components/atoms/icons/social-icons/whatsapp-icon.astro'

export function getNavigation(lang: 'es' | 'pl' | 'en') {
 return [
  {
   title: 'nav.about',
   url: `/${lang}/about`
  },
  {
   title: 'nav.contact',
   url: `/${lang}/contact`
  },
  {
   title: 'nav.projects',
   url: `/${lang}/projects`
  },
  {
   title: 'nav.blog',
   url: `/${lang}/blog`
  }
 ] as const
}

export const socialNavigation = [
 { label: 'GitHub', url: 'https://github.com/DominikFrackowiak', icon: GithubIcon },
 { label: 'LinkedIn', url: 'https://www.linkedin.com/in/dominik-frackowiak', icon: LinkedinIcon },
 { label: 'CodePen', url: 'https://codepen.io/MarianKoniuszko/pens/popular', icon: CodepenIcon },
 { label: 'WhatsApp', url: 'https://wa.me/34654114393?text=Hello', icon: WhatsappIcon },
] as const

