import { useRouter } from 'next/navigation'
// 훅 컨벤션을 위해 만든 샘플코드입니다. 실제로는 useRouter로 back 구현하셔야합니다. 
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
