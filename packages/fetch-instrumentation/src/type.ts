export interface HttpPayload {
  api: string
  request: HttpRequest
  response: HttpResponse
}

export interface HttpRequest {
  method: string
  url: string
  headers: { [key: string]: string }
  body?: string
  timestamp: number
}

export interface HttpResponse {
  status: number
  duration: number
  headers: { [key: string]: string }
  body?: string
  timing?: PerformanceResourceTiming
  timestamp: number
}
