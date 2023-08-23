import Image from 'next/image'
import yellowInfo from '@/public/yellow-info.svg'
export default function InfoIcon() {
	return <Image src={yellowInfo} alt="Icône d'information" />
}
