﻿using CareBridgeBackend.Data;
using CareBridgeBackend.DTOs;
using CareBridgeBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CareBridgeBackend.Controllers
{
    [Route("api/treatments")]
    [ApiController]
    public class TreatmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TreatmentController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieve all treatments for a specific patient diagnostic.
        /// </summary>
        [HttpGet("diagnostic/{patientDiagnosticId}")]
        public async Task<IActionResult> GetTreatmentsForDiagnostic(int patientDiagnosticId)
        {
            var treatments = await _context.Treatments
                .Where(t => t.PatientDiagnosticId == patientDiagnosticId)
                .Select(t => new TreatmentDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Description = t.Description,
                    PatientDiagnosticId = t.PatientDiagnosticId,
                    StartDate = t.StartDate,
                    EndDate = t.EndDate
                })
                .ToListAsync();

            return Ok(treatments);
        }

        /// <summary>
        /// Create a new treatment.
        /// </summary>
        [Authorize(Roles = "Doctor,Assistant")]
        [HttpPost]
        public async Task<IActionResult> CreateTreatment([FromBody] TreatmentCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Validate that the PatientDiagnostic exists
            bool diagnosticExists = await _context.PatientDiagnostics
                .AnyAsync(pd => pd.Id == dto.PatientDiagnosticId);
            if (!diagnosticExists)
                return BadRequest(new { Message = "The provided PatientDiagnosticId does not exist. Please create a diagnostic first." });

            // Map the DTO to a Treatment entity.
            var treatment = new Treatment
            {
                Name = dto.Name,
                Description = dto.Description,
                PatientDiagnosticId = dto.PatientDiagnosticId,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate
            };

            _context.Treatments.Add(treatment);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Treatment created successfully.", TreatmentId = treatment.Id });
        }

        /// <summary>
        /// Update an existing treatment.
        /// </summary>
        [Authorize(Roles = "Doctor,Assistant")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTreatment(int id, [FromBody] TreatmentUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var treatment = await _context.Treatments.FindAsync(id);
            if (treatment == null)
                return NotFound(new { Message = "Treatment not found." });

            // Update fields if provided
            if (!string.IsNullOrEmpty(dto.Name))
                treatment.Name = dto.Name;
            if (!string.IsNullOrEmpty(dto.Description))
                treatment.Description = dto.Description;
            if (dto.StartDate.HasValue)
                treatment.StartDate = dto.StartDate.Value;
            if (dto.EndDate.HasValue)
                treatment.EndDate = dto.EndDate.Value;

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Treatment updated successfully." });
        }

        /// <summary>
        /// Delete a treatment.
        /// </summary>
        [Authorize(Roles = "Doctor,Assistant")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTreatment(int id)
        {
            var treatment = await _context.Treatments.FindAsync(id);
            if (treatment == null)
                return NotFound(new { Message = "Treatment not found." });

            _context.Treatments.Remove(treatment);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Treatment deleted successfully." });
        }
    }
}
