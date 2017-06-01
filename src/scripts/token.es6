define(() => {
  return `Bearer ${$.cookie('X-Authorization')}`
  // return `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzAwMDAwMDAwMCIsImp0aSI6Ijg2NDcyODI2NTk3Mzg2NjQ5NiIsInNjb3BlcyI6WyIvOkdFVCJdLCJpc3MiOiJodHRwOi8vb3N3b3JkLmNvbSIsImlhdCI6MTQ5NjI5NjEzNSwiZXhwIjoxNDk2MzAzMzM1fQ.sinXRCwYLmgtIV0-U8kndQZYGWVVHUBnk9l7pRbYKHmm8cbkVtPNBB0lBm7n5e70Jb8iY6dHoOAgc-hYz1-QjQ`
})
