// import express from 'express';
// import {
//   createAdmin, loginAdmin
// } from '../controllers/adminController';
// import {
//   getOwners, getOwnerById, updateOwner, deleteOwner
// } from '../controllers/Owner/ownerController';
// import {
//   createClient, getClients, getClientById, updateClient, deleteClient
// } from '../controllers/clientController';
// import {
//   createEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee
// } from '../controllers/employeeController';
// import {
//   createNotification, getNotifications, getNotificationById, updateNotification, deleteNotification
// } from '../controllers/notificationController';
// import {
//   createSalon, getAllSalons, getSalonById, updateSalon, deleteSalon, getSalonsByOwnerId
// } from '../controllers/salonController';
// import {
//   createService, getServices, getServiceById, updateService, deleteService
// } from '../controllers/serviceController';
// import {
//   createAppointment, getAppointments, getAppointmentById, updateAppointment, deleteAppointment
// } from '../controllers/appointmentController';
// import authMiddleware from '../middlewares/authMiddleware';

// const router = express.Router();

// // Admin authentication routes
// router.post('/admins/register', createAdmin);
// router.post('/admins/login', loginAdmin);

// // Owner routes
// router.get('/owners', authMiddleware, getOwners);
// router.get('/owners/:id', authMiddleware, getOwnerById);
// router.put('/owners/:id', authMiddleware, updateOwner);
// router.delete('/owners/:id', authMiddleware, deleteOwner);

// // Client routes
// router.post('/clients', authMiddleware, createClient);
// router.get('/clients', authMiddleware, getClients);  // Consider adding pagination support
// router.get('/clients/:id', authMiddleware, getClientById);
// router.put('/clients/:id', authMiddleware, updateClient);
// router.delete('/clients/:id', authMiddleware, deleteClient);

// // Employee routes (add hierarchical context for salons)
// router.post('/salons/:salonId/employees', authMiddleware, createEmployee);
// router.get('/salons/:salonId/employees', authMiddleware, getEmployees);
// router.get('/salons/:salonId/employees/:id', authMiddleware, getEmployeeById);
// router.put('/salons/:salonId/employees/:id', authMiddleware, updateEmployee);
// router.delete('/salons/:salonId/employees/:id', authMiddleware, deleteEmployee);

// // Notification routes
// router.post('/notifications', authMiddleware, createNotification);
// router.get('/notifications', authMiddleware, getNotifications);
// router.get('/notifications/:id', authMiddleware, getNotificationById);
// router.put('/notifications/:id', authMiddleware, updateNotification);
// router.delete('/notifications/:id', authMiddleware, deleteNotification);

// // Salon routes
// router.post('/salons', authMiddleware, createSalon);
// router.get('/salons', authMiddleware, getAllSalons);  // Add pagination support
// router.get('/salons/:id', authMiddleware, getSalonById);
// router.put('/salons/:id', authMiddleware, updateSalon);
// router.delete('/salons/:id', authMiddleware, deleteSalon);
// router.get('/owners/:ownerId/salons', authMiddleware, getSalonsByOwnerId);

// // Service routes
// router.post('/salons/:salonId/services', authMiddleware, createService);
// router.get('/salons/:salonId/services', authMiddleware, getServices);
// router.get('/salons/:salonId/services/:id', authMiddleware, getServiceById);
// router.put('/salons/:salonId/services/:id', authMiddleware, updateService);
// router.delete('/salons/:salonId/services/:id', authMiddleware, deleteService);

// // Appointment routes
// router.post('/salons/:salonId/appointments', authMiddleware, createAppointment);
// router.get('/salons/:salonId/appointments', authMiddleware, getAppointments);  // Consider adding pagination support
// router.get('/salons/:salonId/appointments/:id', authMiddleware, getAppointmentById);
// router.put('/salons/:salonId/appointments/:id', authMiddleware, updateAppointment);
// router.delete('/salons/:salonId/appointments/:id', authMiddleware, deleteAppointment);

// export default router;
