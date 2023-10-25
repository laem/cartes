'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function SearchParamsLinkClient({ children, href }) {
	const searchParams = useSearchParams()
	return <Link href={href + '?' + searchParams.toString()}>{children}</Link>
}
