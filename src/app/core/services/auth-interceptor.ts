// import { HttpInterceptorFn } from '@angular/common/http';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJDdXN0b21lciIsImVtYWlsIjoidXNlcjFAZXhhbXBsZS5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImFkNGMyY2RkLWNhMDUtNDFlOS05MzUxLTdlOGQ4MTE3M2NmNyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJ1c2VyMUBleGFtcGxlLmNvbSIsInVzZXJUeXBlSWQiOiIxIiwiZXhwIjoxNzUyOTc0NjY1LCJpc3MiOiJKdW1pYUFwaSIsImF1ZCI6Ikp1bWlhQ2xpZW50In0.9KQeSsc3rMDkPo0Pinu1aX20RDsPABboJag6t4PJR8M';
//   const clonedReq = req.clone({
//     setHeaders: {
//       Authorization: `Bearer ${token}`
//     }
//   });
//   return next(clonedReq)

// };
