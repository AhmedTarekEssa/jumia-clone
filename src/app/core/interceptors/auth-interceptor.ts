// import { HttpInterceptorFn } from '@angular/common/http';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {


//   // In a real application, you would get this from a service or storage
//   const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJDdXN0b21lciIsImVtYWlsIjoidXNlcjFAZXhhbXBsZS5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImFkNGMyY2RkLWNhMDUtNDFlOS05MzUxLTdlOGQ4MTE3M2NmNyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJ1c2VyMUBleGFtcGxlLmNvbSIsInVzZXJUeXBlSWQiOiIxIiwiZXhwIjoxNzUzMTIwNjYyLCJpc3MiOiJKdW1pYUFwaSIsImF1ZCI6Ikp1bWlhQ2xpZW50In0.m3Gky9EuqkhoAie0tnIJoKNZNPFiowBqitwuX8jx9gQ";

  // In a real application, you would get this from a service or storage
//   const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJDdXN0b21lciIsImVtYWlsIjoidXNlcjNAZXhhbXBsZS5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImRiMzA4NjVkLTk2YWQtNDJkMS1hNmU3LWQ3OTcxZDg3ZjJhYiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJ1c2VyM0BleGFtcGxlLmNvbSIsInVzZXJUeXBlSWQiOiIzIiwiZXhwIjoxNzUzMzIzMjMyLCJpc3MiOiJKdW1pYUFwaSIsImF1ZCI6Ikp1bWlhQ2xpZW50In0.ojjMqzn7WHU8HKG8k5wAYMMpk0LRF4FIoG0-6H2fqA4";


//   const authReq = req.clone({
//     setHeaders: {
//       Authorization: `Bearer ${token}`

//     }
//   });

//   return next(authReq);
// };
