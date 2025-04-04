﻿using CareBridgeBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace CareBridgeBackend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // DbSets for each entity
        public DbSet<User> Users { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<DiagnosticTemplate> DiagnosticTemplates { get; set; }
        public DbSet<PatientDiagnostic> PatientDiagnostics { get; set; }
        public DbSet<MedicalHistory> MedicalHistories { get; set; }
        public DbSet<Treatment> Treatments { get; set; }
        public DbSet<DoctorAssistant> DoctorAssistants { get; set; }
        public DbSet<DoctorReview> DoctorReviews { get; set; }
        public DbSet<DoctorSchedule> DoctorSchedules { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<Medication> Medications { get; set; }
        public DbSet<Office> Offices { get; set; }

        // Configuring relationships
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Many-to-Many: Doctor to Assistants
            modelBuilder.Entity<DoctorAssistant>()
                .HasOne(da => da.Doctor)
                .WithMany(u => u.DoctorsAssisted)
                .HasForeignKey(da => da.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DoctorAssistant>()
                .HasOne(da => da.Assistant)
                .WithMany(u => u.AssistedBy)
                .HasForeignKey(da => da.AssistantId)
                .OnDelete(DeleteBehavior.Restrict);

            // One-to-One: Patient to MedicalHistory
            modelBuilder.Entity<MedicalHistory>()
                .HasOne(mh => mh.Patient)
                .WithOne(u => u.MedicalHistory)
                .HasForeignKey<MedicalHistory>(mh => mh.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: Appointments (Doctor & Patient)
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Doctor)
                .WithMany(u => u.AppointmentsAsDoctor)  
                .HasForeignKey(a => a.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Patient)
                .WithMany(u => u.AppointmentsAsPatient)  
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            // One-to-Many: PatientDiagnostics
            modelBuilder.Entity<PatientDiagnostic>()
                .HasOne(pd => pd.DiagnosticTemplate)
                .WithMany()
                .HasForeignKey(pd => pd.DiagnosticTemplateId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PatientDiagnostic>()
                .HasOne(pd => pd.DiagnosticTemplate)
                .WithMany()
                .HasForeignKey(pd => pd.DiagnosticTemplateId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PatientDiagnostic>()
                .HasOne(pd => pd.Doctor)
                .WithMany(u => u.DiagnosedPatients)
                .HasForeignKey(pd => pd.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            // One-to-Many: Treatments
            modelBuilder.Entity<Treatment>()
                .HasOne(t => t.PatientDiagnostic)
                .WithMany(pd => pd.Treatments)
                .HasForeignKey(t => t.PatientDiagnosticId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: Diagnostic Templates (Created by Doctor)
            modelBuilder.Entity<DiagnosticTemplate>()
                .HasOne(d => d.CreatedByDoctor)
                .WithMany()
                .HasForeignKey(d => d.CreatedByDoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Doctor Review Relationships
            modelBuilder.Entity<DoctorReview>()
                .HasOne(dr => dr.Doctor)
                .WithMany()
                .HasForeignKey(dr => dr.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DoctorReview>()
                .HasOne(dr => dr.Patient)
                .WithMany()
                .HasForeignKey(dr => dr.PatientId)
                .OnDelete(DeleteBehavior.NoAction);

            // Doctor Schedules Relationships
            modelBuilder.Entity<DoctorSchedule>()
                .HasOne(ds => ds.Doctor)
                .WithMany(u => u.DoctorSchedules)
                .HasForeignKey(ds => ds.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);

            // Many-to-One: Appointments to Prescriptions
            modelBuilder.Entity<Prescription>()
                .HasOne(p => p.Appointment)
                .WithMany(a => a.Prescriptions)
                .HasForeignKey(p => p.AppointmentId)
                .OnDelete(DeleteBehavior.Cascade); 

            // One-to-Many: Prescription to Medications
            modelBuilder.Entity<Medication>()
                .HasOne(m => m.Prescription)
                .WithMany(p => p.Medications)
                .HasForeignKey(m => m.PrescriptionId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: Doctor to Prescriptions
            modelBuilder.Entity<Prescription>()
                .HasOne(p => p.Doctor)
                .WithMany(u => u.PrescriptionsAsDoctor)
                .HasForeignKey(p => p.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            // One-to-Many: Patient to Prescriptions
            modelBuilder.Entity<Prescription>()
                .HasOne(p => p.Patient)
                .WithMany(u => u.PrescriptionsAsPatient)
                .HasForeignKey(p => p.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            // One-to-Many: Office → Doctors
            modelBuilder.Entity<Office>()
                .HasMany(o => o.Doctors)
                .WithOne(u => u.Office)
                .HasForeignKey(u => u.OfficeId)
                .OnDelete(DeleteBehavior.SetNull);

            // Seed Data for Users
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    FirstName = "Alice",
                    LastName = "Smith",
                    Email = "alice.smith@hospital.com",
                    PhoneNumber = "123-456-7890",
                    Password = "hashed_password_1",
                    Role = UserRole.Doctor,
                    Specialization = "Cardiology",
                    LicenseNumber = "CARD-001"
                },
                new User
                {
                    Id = 2,
                    FirstName = "John",
                    LastName = "Doe",
                    Email = "john.doe@hospital.com",
                    PhoneNumber = "321-654-0987",
                    Password = "hashed_password_2",
                    Role = UserRole.Doctor,
                    Specialization = "Neurology",
                    LicenseNumber = "NEUR-002"
                },
                new User
                {
                    Id = 3,
                    FirstName = "Mark",
                    LastName = "Green",
                    Email = "mark.green@hospital.com",
                    PhoneNumber = "234-567-8910",
                    Password = "hashed_password_3",
                    Role = UserRole.Assistant
                },
                new User
                {
                    Id = 4,
                    FirstName = "Jane",
                    LastName = "White",
                    Email = "jane.white@hospital.com",
                    PhoneNumber = "567-890-1234",
                    Password = "hashed_password_4",
                    Role = UserRole.Assistant
                },
                new User
                {
                    Id = 5,
                    FirstName = "Tom",
                    LastName = "Brown",
                    Email = "tom.brown@health.com",
                    PhoneNumber = "456-789-0123",
                    Password = "hashed_password_5",
                    Role = UserRole.Patient,
                    DateOfBirth = new DateTime(1985, 6, 15)
                },
                new User
                {
                    Id = 6,
                    FirstName = "Lisa",
                    LastName = "Black",
                    Email = "lisa.black@health.com",
                    PhoneNumber = "678-901-2345",
                    Password = "hashed_password_6",
                    Role = UserRole.Patient,
                    DateOfBirth = new DateTime(1992, 11, 25)
                }
            );

            // Seed Data for Diagnostic Templates
            modelBuilder.Entity<DiagnosticTemplate>().HasData(
                new DiagnosticTemplate
                {
                    Id = 1,
                    Name = "Basic Heart Checkup",
                    Description = "Heart-related diagnostics including ECG and blood pressure",
                    CreatedByDoctorId = 1
                },
                new DiagnosticTemplate
                {
                    Id = 2,
                    Name = "Neurological Assessment",
                    Description = "Tests for neurological reflexes and cognitive functions",
                    CreatedByDoctorId = 2
                }
            );

            base.OnModelCreating(modelBuilder);
        }
    }
}
