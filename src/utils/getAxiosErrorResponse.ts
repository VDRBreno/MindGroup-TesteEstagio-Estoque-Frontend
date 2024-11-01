export default function getAxiosErrorResponse(error: unknown) {
  if(error && typeof error==='object' && 'name' in error && error.name==='AxiosError') {
    if('response' in error && error.response && typeof error.response==='object') {
      if('data' in error.response && error.response.data && typeof error.response.data==='object') {
        if('error_code' in error.response.data && error.response.data.error_code && typeof error.response.data.error_code==='string' &&
          'error_description' in error.response.data && error.response.data.error_description && typeof error.response.data.error_description==='string'
        ) {
          return {
            error_code: error.response.data.error_code,
            error_description: error.response.data.error_description
          };
        }
      }
    }
  }
  return;
}