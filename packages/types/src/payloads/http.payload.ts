export interface HttpPayload extends HttpStartPayload {
  response: HttpResponse
}

export interface HttpStartPayload {
  api: string
  request: HttpRequest
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