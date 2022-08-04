import { useRouter } from 'next/router'
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/solid'

const MenuItem = ({ href, children, newWindow = false }) => {
  const { asPath } = useRouter()

  return (
    <Link href={href} shallow={true}>
      <a
        className={`h-full border-b border-th-bkg-4 md:border-none flex justify-between text-th-fgd-1 font-bold items-center p-3 md:py-0 hover:text-light-theme-lagrangenavcolor
          ${
            asPath === href
              ? `text-light-theme-lagrangenavcolor underline`
              : `border-transparent`
          }
        `}
        target={newWindow ? '_blank' : ''}
        rel={newWindow ? 'noopener noreferrer' : ''}
      >
        {children}
        <ChevronRightIcon className="w-5 h-5 md:hidden" />
      </a>
    </Link>
  )
}

export default MenuItem
