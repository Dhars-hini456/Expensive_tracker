package com.expensetracker.controller;

import com.expensetracker.model.Expense;
import com.expensetracker.repository.ExpenseRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    public static final List<Map<String, String>> CATEGORIES = Arrays.asList(
            Map.of("value", "Food", "label", "Food"),
            Map.of("value", "Transport", "label", "Transport"),
            Map.of("value", "Shopping", "label", "Shopping"),
            Map.of("value", "Education", "label", "Education"),
            Map.of("value", "Bills", "label", "Bills"),
            Map.of("value", "Healthcare", "label", "Healthcare"),
            Map.of("value", "Entertainment", "label", "Entertainment"),
            Map.of("value", "Other", "label", "Other")
    );

    public static final List<Map<String, String>> PAYMENT_METHODS = Arrays.asList(
            Map.of("value", "Cash", "label", "Cash"),
            Map.of("value", "Credit Card", "label", "Credit Card"),
            Map.of("value", "Debit Card", "label", "Debit Card"),
            Map.of("value", "UPI", "label", "UPI"),
            Map.of("value", "Bank Transfer", "label", "Bank Transfer")
    );

    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createExpense(@Valid @RequestBody Expense expense) {
        Expense saved = expenseRepository.save(expense);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Expense created successfully.");
        response.put("data", saved);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getExpenseById(@PathVariable Long id) {
        Optional<Expense> expense = expenseRepository.findById(id);
        if (expense.isPresent()) {
            return ResponseEntity.ok(expense.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("detail", "Not found."));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateExpense(@PathVariable Long id, @Valid @RequestBody Expense expenseDetails) {
        return expenseRepository.findById(id).map(expense -> {
            expense.setTitle(expenseDetails.getTitle());
            expense.setAmount(expenseDetails.getAmount());
            expense.setCategory(expenseDetails.getCategory());
            expense.setDate(expenseDetails.getDate());
            expense.setPaymentMethod(expenseDetails.getPaymentMethod());
            expense.setDescription(expenseDetails.getDescription());
            Expense updated = expenseRepository.save(expense);
            return ResponseEntity.ok(Map.of("message", "Expense updated successfully.", "data", updated));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("detail", "Not found.")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        return expenseRepository.findById(id).map(expense -> {
            expenseRepository.delete(expense);
            return ResponseEntity.ok(Map.of("message", "Expense \"" + expense.getTitle() + "\" deleted successfully."));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("detail", "Not found.")));
    }

    @GetMapping("/categories")
    public List<Map<String, String>> getCategories() {
        return CATEGORIES;
    }

    @GetMapping("/payment_methods")
    public List<Map<String, String>> getPaymentMethods() {
        return PAYMENT_METHODS;
    }

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        List<Expense> all = expenseRepository.findAll();
        BigDecimal totalAmount = all.stream().map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> summary = new HashMap<>();
        summary.put("total_amount", totalAmount);
        summary.put("total_count", all.size());
        return summary;
    }
}

