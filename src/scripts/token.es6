define(() => {
  return `Bearer ${$.cookie('X-Authorization')}`
  // return `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzAwMDAwMDAwMCIsImp0aSI6Ijg2NDcyODI2NTk3Mzg2NjQ5NiIsInNjb3BlcyI6WyIvOkdFVCJdLCJpc3MiOiJodHRwOi8vb3N3b3JkLmNvbSIsImlhdCI6MTQ5NjY0NDcyOSwiZXhwIjoxNDk2NjUxOTI5fQ.jCVmDp1uGk7iLa1xzSCfLk7W3o6koFCpeE2VYsCkn9vPU3YIqs09C7yf0dxk6p7nBV2ptH1iaiVMoazdpwHBtA`
})
