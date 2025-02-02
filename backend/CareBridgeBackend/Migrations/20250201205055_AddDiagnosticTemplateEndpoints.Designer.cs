﻿// <auto-generated />
using System;
using CareBridgeBackend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace CareBridgeBackend.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20250201205055_AddDiagnosticTemplateEndpoints")]
    partial class AddDiagnosticTemplateEndpoints
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("CareBridgeBackend.Models.Appointment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("AppointmentDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("DoctorId")
                        .HasColumnType("int");

                    b.Property<int?>("MedicalHistoryId")
                        .HasColumnType("int");

                    b.Property<string>("Notes")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("PatientId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("DoctorId");

                    b.HasIndex("MedicalHistoryId");

                    b.HasIndex("PatientId");

                    b.ToTable("Appointments");
                });

            modelBuilder.Entity("CareBridgeBackend.Models.DiagnosticTemplate", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("CreatedByDoctorId")
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.HasKey("Id");

                    b.HasIndex("CreatedByDoctorId");

                    b.ToTable("DiagnosticTemplates");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            CreatedByDoctorId = 1,
                            Description = "Heart-related diagnostics including ECG and blood pressure",
                            Name = "Basic Heart Checkup"
                        },
                        new
                        {
                            Id = 2,
                            CreatedByDoctorId = 2,
                            Description = "Tests for neurological reflexes and cognitive functions",
                            Name = "Neurological Assessment"
                        });
                });

            modelBuilder.Entity("CareBridgeBackend.Models.DoctorAssistant", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("AssignedDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("AssistantId")
                        .HasColumnType("int");

                    b.Property<int>("DoctorId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("AssistantId");

                    b.HasIndex("DoctorId");

                    b.ToTable("DoctorAssistants");
                });

            modelBuilder.Entity("CareBridgeBackend.Models.DoctorReview", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("DoctorId")
                        .HasColumnType("int");

                    b.Property<int>("PatientId")
                        .HasColumnType("int");

                    b.Property<int>("Rating")
                        .HasColumnType("int");

                    b.Property<DateTime>("ReviewDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("ReviewText")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");

                    b.HasKey("Id");

                    b.HasIndex("DoctorId");

                    b.HasIndex("PatientId");

                    b.ToTable("DoctorReviews");
                });

            modelBuilder.Entity("CareBridgeBackend.Models.DoctorSchedule", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Description")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");

                    b.Property<int>("DoctorId")
                        .HasColumnType("int");

                    b.Property<DateTime>("EndTime")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("StartTime")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("DoctorId");

                    b.ToTable("DoctorSchedules");
                });

            modelBuilder.Entity("CareBridgeBackend.Models.MedicalHistory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("PatientId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("PatientId")
                        .IsUnique();

                    b.ToTable("MedicalHistories");
                });

            modelBuilder.Entity("CareBridgeBackend.Models.PatientDiagnostic", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("DateDiagnosed")
                        .HasColumnType("datetime2");

                    b.Property<int>("DiagnosticTemplateId")
                        .HasColumnType("int");

                    b.Property<int>("DoctorId")
                        .HasColumnType("int");

                    b.Property<int?>("MedicalHistoryId")
                        .HasColumnType("int");

                    b.Property<string>("Notes")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("PatientId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("DiagnosticTemplateId");

                    b.HasIndex("DoctorId");

                    b.HasIndex("MedicalHistoryId");

                    b.HasIndex("PatientId");

                    b.ToTable("PatientDiagnostics");
                });

            modelBuilder.Entity("CareBridgeBackend.Models.Treatment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");

                    b.Property<DateTime?>("EndDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("PatientDiagnosticId")
                        .HasColumnType("int");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("PatientDiagnosticId");

                    b.ToTable("Treatments");
                });

            modelBuilder.Entity("CareBridgeBackend.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("DateOfBirth")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("LicenseNumber")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Role")
                        .HasColumnType("int");

                    b.Property<string>("Specialization")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("Id");

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            DateOfBirth = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Email = "alice.smith@hospital.com",
                            FirstName = "Alice",
                            LastName = "Smith",
                            LicenseNumber = "CARD-001",
                            Password = "hashed_password_1",
                            PhoneNumber = "123-456-7890",
                            Role = 0,
                            Specialization = "Cardiology"
                        },
                        new
                        {
                            Id = 2,
                            DateOfBirth = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Email = "john.doe@hospital.com",
                            FirstName = "John",
                            LastName = "Doe",
                            LicenseNumber = "NEUR-002",
                            Password = "hashed_password_2",
                            PhoneNumber = "321-654-0987",
                            Role = 0,
                            Specialization = "Neurology"
                        },
                        new
                        {
                            Id = 3,
                            DateOfBirth = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Email = "mark.green@hospital.com",
                            FirstName = "Mark",
                            LastName = "Green",
                            Password = "hashed_password_3",
                            PhoneNumber = "234-567-8910",
                            Role = 2
                        },
                        new
                        {
                            Id = 4,
                            DateOfBirth = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Email = "jane.white@hospital.com",
                            FirstName = "Jane",
                            LastName = "White",
                            Password = "hashed_password_4",
                            PhoneNumber = "567-890-1234",
                            Role = 2
                        },
                        new
                        {
                            Id = 5,
                            DateOfBirth = new DateTime(1985, 6, 15, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Email = "tom.brown@health.com",
                            FirstName = "Tom",
                            LastName = "Brown",
                            Password = "hashed_password_5",
                            PhoneNumber = "456-789-0123",
                            Role = 1
                        },
                        new
                        {
                            Id = 6,
                            DateOfBirth = new DateTime(1992, 11, 25, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Email = "lisa.black@health.com",
                            FirstName = "Lisa",
                            LastName = "Black",
                            Password = "hashed_password_6",
                            PhoneNumber = "678-901-2345",
                            Role = 1
                        });
                });

            modelBuilder.Entity("CareBridgeBackend.Models.Appointment", b =>
                {
                    b.HasOne("CareBridgeBackend.Models.User", "Doctor")
                        .WithMany("AppointmentsAsDoctor")
                        .HasForeignKey("DoctorId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("CareBridgeBackend.Models.MedicalHistory", null)
                        .WithMany("Appointments")
                        .HasForeignKey("MedicalHistoryId");

                    b.HasOne("CareBridgeBackend.Models.User", "Patient")
                        .WithMany("AppointmentsAsPatient")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Doctor");

                    b.Navigation("Patient");
                });

            modelBuilder.Entity("CareBridgeBackend.Models.DiagnosticTemplate", b =>
                {
                    b.HasOne("CareBridgeBackend.Models.User", "CreatedByDoctor")
                        .WithMany()
                        .HasForeignKey("CreatedByDoctorId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("CreatedByDoctor");
                });

            modelBuilder.Entity("CareBridgeBackend.Models.DoctorAssistant", b =>
                {
                    b.HasOne("CareBridgeBackend.Models.User", "Assistant")
                        .WithMany("AssistedBy")
                        .HasForeignKey("AssistantId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("CareBridgeBackend.Models.User", "Doctor")
                        .WithMany("DoctorsAssisted")
                        .HasForeignKey("DoctorId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Assistant");

                    b.Navigation("Doctor");
                });

            modelBuilder.Entity("CareBridgeBackend.Models.DoctorReview", b =>
                {
                    b.HasOne("CareBridgeBackend.Models.User", "Doctor")
                        .WithMany()
                        .HasForeignKey("DoctorId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("CareBridgeBackend.Models.User", "Patient")
                        .WithMany()
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Doctor");

                    b.Navigation("Patient");
                });

            modelBuilder.Entity("CareBridgeBackend.Models.DoctorSchedule", b =>
                {
                    b.HasOne("CareBridgeBackend.Models.User", "Doctor")
                        .WithMany("DoctorSchedules")
                        .HasForeignKey("DoctorId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Doctor");
                });

            modelBuilder.Entity("CareBridgeBackend.Models.MedicalHistory", b =>
                {
                    b.HasOne("CareBridgeBackend.Models.User", "Patient")
                        .WithOne("MedicalHistory")
                        .HasForeignKey("CareBridgeBackend.Models.MedicalHistory", "PatientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Patient");
                });

            modelBuilder.Entity("CareBridgeBackend.Models.PatientDiagnostic", b =>
                {
                    b.HasOne("CareBridgeBackend.Models.DiagnosticTemplate", "DiagnosticTemplate")
                        .WithMany()
                        .HasForeignKey("DiagnosticTemplateId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("CareBridgeBackend.Models.User", "Doctor")
                        .WithMany("DiagnosedPatients")
                        .HasForeignKey("DoctorId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("CareBridgeBackend.Models.MedicalHistory", null)
                        .WithMany("PatientDiagnostics")
                        .HasForeignKey("MedicalHistoryId");

                    b.HasOne("CareBridgeBackend.Models.User", "Patient")
                        .WithMany("DiagnosedByDoctors")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("DiagnosticTemplate");

                    b.Navigation("Doctor");

                    b.Navigation("Patient");
                });

            modelBuilder.Entity("CareBridgeBackend.Models.Treatment", b =>
                {
                    b.HasOne("CareBridgeBackend.Models.PatientDiagnostic", "PatientDiagnostic")
                        .WithMany("Treatments")
                        .HasForeignKey("PatientDiagnosticId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("PatientDiagnostic");
                });

            modelBuilder.Entity("CareBridgeBackend.Models.MedicalHistory", b =>
                {
                    b.Navigation("Appointments");

                    b.Navigation("PatientDiagnostics");
                });

            modelBuilder.Entity("CareBridgeBackend.Models.PatientDiagnostic", b =>
                {
                    b.Navigation("Treatments");
                });

            modelBuilder.Entity("CareBridgeBackend.Models.User", b =>
                {
                    b.Navigation("AppointmentsAsDoctor");

                    b.Navigation("AppointmentsAsPatient");

                    b.Navigation("AssistedBy");

                    b.Navigation("DiagnosedByDoctors");

                    b.Navigation("DiagnosedPatients");

                    b.Navigation("DoctorSchedules");

                    b.Navigation("DoctorsAssisted");

                    b.Navigation("MedicalHistory");
                });
#pragma warning restore 612, 618
        }
    }
}
