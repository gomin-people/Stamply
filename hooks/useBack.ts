import { useRouter } from 'next/navigation'

type UseBackReturn = {
  back: () => void
}

export const useBack = (): UseBackReturn => {
  const router = useRouter()

  const back = () => {
    router.back()
  }

  return { back }
}

// type UseExampleReturn = {}

// export const useExample = (): UseExampleReturn => {
//   return {}
// }
