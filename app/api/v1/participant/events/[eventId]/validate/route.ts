import { type NextRequest } from 'next/server'
import {
  badRequest,
  notFound,
  ok,
  parsePositiveInteger,
  validateEvent,
} from '@/utils/api'

type RouteContext = {
  params: Promise<{
    eventId: string
  }>
}

/**
 * 특정 행사 ID의 유효성 및 존재 여부를 검증하는 참여자 도메인용 API 엔드포인트입니다.
 *
 * @param request - HTTP 요청 객체
 * @param context - 행사 ID route parameter
 * @returns 검증 결과 JSON 응답
 */
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  const { eventId: eventIdParam } = await params
  const eventId = parsePositiveInteger(eventIdParam)

  if (eventId === null) {
    return badRequest('올바른 행사 ID가 필요합니다.')
  }

  const isValid = await validateEvent(eventIdParam)

  if (!isValid) {
    return notFound('존재하지 않는 행사입니다.')
  }

  return ok({ valid: true })
}
