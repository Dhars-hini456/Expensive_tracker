import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class ExpenseTrackerCLI {

    public static class Expense {
        private static long idCounter = 1;

        private Long id;
        private String title;
        private BigDecimal amount;
        private String category;
        private LocalDate date;
        private String paymentMethod;
        private String description;
        private LocalDateTime createdAt;

        public Expense(String title, BigDecimal amount, String category, LocalDate date, String paymentMethod, String description) {
            this.id = idCounter++;
            this.title = title;
            this.amount = amount;
            this.category = category;
            this.date = date;
            this.paymentMethod = paymentMethod;
            this.description = description == null ? "" : description;
            this.createdAt = LocalDateTime.now();
        }

        public Long getId() { return id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }
        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public LocalDateTime getCreatedAt() { return createdAt; }

        @Override
        public String toString() {
            return String.format("[%d] %s | Rs. %.2f | Category: %s | Date: %s | Payment: %s | Desc: %s",
                    id, title, amount, category, date, paymentMethod, description.isEmpty() ? "N/A" : description);
        }
    }

    public static final List<String> CATEGORIES = Arrays.asList(
            "Food", "Transport", "Shopping", "Education", "Bills", "Healthcare", "Entertainment", "Other"
    );

    public static final List<String> PAYMENT_METHODS = Arrays.asList(
            "Cash", "Credit Card", "Debit Card", "UPI", "Bank Transfer"
    );

    private static final List<Expense> expenses = new ArrayList<>();

    public static void main(String[] args) {
        // Seed sample data matching backend Django tests
        seedSampleData();

        System.out.println("=================================================");
        System.out.println("   WELCOME TO EXPENSE TRACKER (JAVA CONSOLE CLI) ");
        System.out.println("=================================================");

        // Run non-interactive quick automated test suite first
        runAutomatedTests();

        Scanner scanner = new Scanner(System.in);
        boolean running = true;

        while (running) {
            printMenu();
            System.out.print("Enter choice (1-8): ");
            String input = scanner.nextLine().trim();

            switch (input) {
                case "1":
                    listExpenses();
                    break;
                case "2":
                    addExpense(scanner);
                    break;
                case "3":
                    updateExpense(scanner);
                    break;
                case "4":
                    deleteExpense(scanner);
                    break;
                case "5":
                    showSummary();
                    break;
                case "6":
                    filterExpenses(scanner);
                    break;
                case "7":
                    runAutomatedTests();
                    break;
                case "8":
                    running = false;
                    System.out.println("Exiting Expense Tracker CLI. Goodbye!");
                    break;
                default:
                    System.out.println("Invalid choice! Please select 1 to 8.");
            }
        }
        scanner.close();
    }

    private static void seedSampleData() {
        expenses.add(new Expense("Lunch", new BigDecimal("250.00"), "Food", LocalDate.of(2026, 1, 5), "Cash", "Team lunch"));
        expenses.add(new Expense("Bus Ticket", new BigDecimal("50.00"), "Transport", LocalDate.of(2026, 1, 6), "UPI", "Daily commute"));
        expenses.add(new Expense("Grocery", new BigDecimal("1200.00"), "Food", LocalDate.of(2026, 1, 7), "Debit Card", "Weekly veggies"));
        expenses.add(new Expense("Internet Bill", new BigDecimal("799.00"), "Bills", LocalDate.of(2026, 1, 10), "Bank Transfer", "Broadband renewal"));
    }

    private static void printMenu() {
        System.out.println("\n---------------- MENU OPTIONS ----------------");
        System.out.println("1. List All Expenses");
        System.out.println("2. Add New Expense");
        System.out.println("3. Update Expense");
        System.out.println("4. Delete Expense");
        System.out.println("5. Show Expense Summary & Statistics");
        System.out.println("6. Filter / Search Expenses");
        System.out.println("7. Run Verification Test Suite");
        System.out.println("8. Exit");
        System.out.println("----------------------------------------------");
    }

    private static void listExpenses() {
        System.out.println("\n=== Expense List ===");
        if (expenses.isEmpty()) {
            System.out.println("No expenses found.");
            return;
        }
        for (Expense e : expenses) {
            System.out.println(e);
        }
    }

    private static void addExpense(Scanner scanner) {
        System.out.println("\n=== Add New Expense ===");

        System.out.print("Enter Title (min 2 chars): ");
        String title = scanner.nextLine().trim();
        if (title.length() < 2) {
            System.out.println("Error: Title must be at least 2 characters long.");
            return;
        }

        System.out.print("Enter Amount (> 0): ");
        BigDecimal amount;
        try {
            amount = new BigDecimal(scanner.nextLine().trim());
            if (amount.compareTo(BigDecimal.ZERO) <= 0) {
                System.out.println("Error: Amount must be greater than 0.");
                return;
            }
        } catch (Exception e) {
            System.out.println("Error: Invalid numeric amount.");
            return;
        }

        System.out.println("Categories: " + CATEGORIES);
        System.out.print("Enter Category: ");
        String category = scanner.nextLine().trim();
        if (!CATEGORIES.contains(category)) {
            System.out.println("Error: Invalid category! Select from: " + CATEGORIES);
            return;
        }

        System.out.print("Enter Date (YYYY-MM-DD) or press Enter for Today: ");
        String dateStr = scanner.nextLine().trim();
        LocalDate date = dateStr.isEmpty() ? LocalDate.now() : LocalDate.parse(dateStr);
        if (date.isAfter(LocalDate.now())) {
            System.out.println("Error: Date cannot be in the future.");
            return;
        }

        System.out.println("Payment Methods: " + PAYMENT_METHODS);
        System.out.print("Enter Payment Method: ");
        String paymentMethod = scanner.nextLine().trim();
        if (!PAYMENT_METHODS.contains(paymentMethod)) {
            System.out.println("Error: Invalid payment method! Select from: " + PAYMENT_METHODS);
            return;
        }

        System.out.print("Enter Description (Optional): ");
        String description = scanner.nextLine().trim();

        Expense newExpense = new Expense(title, amount, category, date, paymentMethod, description);
        expenses.add(newExpense);
        System.out.println("✅ Expense created successfully: " + newExpense);
    }

    private static void updateExpense(Scanner scanner) {
        System.out.print("Enter Expense ID to update: ");
        try {
            Long id = Long.parseLong(scanner.nextLine().trim());
            Expense expense = findById(id);
            if (expense == null) {
                System.out.println("Error: Expense not found with ID " + id);
                return;
            }

            System.out.print("New Title (leave blank to keep '" + expense.getTitle() + "'): ");
            String title = scanner.nextLine().trim();
            if (!title.isEmpty()) expense.setTitle(title);

            System.out.print("New Amount (leave blank to keep Rs. " + expense.getAmount() + "): ");
            String amtStr = scanner.nextLine().trim();
            if (!amtStr.isEmpty()) {
                BigDecimal amt = new BigDecimal(amtStr);
                if (amt.compareTo(BigDecimal.ZERO) > 0) expense.setAmount(amt);
            }

            System.out.println("✅ Expense updated successfully: " + expense);
        } catch (Exception e) {
            System.out.println("Error invalid input.");
        }
    }

    private static void deleteExpense(Scanner scanner) {
        System.out.print("Enter Expense ID to delete: ");
        try {
            Long id = Long.parseLong(scanner.nextLine().trim());
            Expense expense = findById(id);
            if (expense == null) {
                System.out.println("Error: Expense not found.");
                return;
            }
            expenses.remove(expense);
            System.out.println("✅ Expense deleted successfully.");
        } catch (Exception e) {
            System.out.println("Error invalid input.");
        }
    }

    private static void showSummary() {
        System.out.println("\n=== Expense Summary & Analytics ===");
        BigDecimal totalAmount = BigDecimal.ZERO;
        Map<String, BigDecimal> catTotals = new HashMap<>();

        for (Expense e : expenses) {
            totalAmount = totalAmount.add(e.getAmount());
            catTotals.put(e.getCategory(), catTotals.getOrDefault(e.getCategory(), BigDecimal.ZERO).add(e.getAmount()));
        }

        System.out.println("Total Expenses Count : " + expenses.size());
        System.out.println("Total Amount Spent   : Rs. " + totalAmount);
        System.out.println("\nCategory Breakdown:");
        catTotals.forEach((cat, amt) -> System.out.println("  - " + cat + ": Rs. " + amt));
    }

    private static void filterExpenses(Scanner scanner) {
        System.out.print("Enter search query (title/description/category): ");
        String query = scanner.nextLine().trim().toLowerCase();

        System.out.println("\n--- Search Results ---");
        expenses.stream()
                .filter(e -> e.getTitle().toLowerCase().contains(query) ||
                             e.getDescription().toLowerCase().contains(query) ||
                             e.getCategory().toLowerCase().contains(query))
                .forEach(System::println);
    }

    private static void runAutomatedTests() {
        System.out.println("\n[AUTOMATED TEST RUNNER]");
        int initialSize = expenses.size();
        
        // Test Create
        Expense t = new Expense("Test Movie", new BigDecimal("350.00"), "Entertainment", LocalDate.now(), "UPI", "Cinema ticket");
        expenses.add(t);
        assert expenses.size() == initialSize + 1 : "Creation test failed";
        System.out.println("  ✔ Test Create Expense: PASSED");

        // Test Find & Update
        Expense found = findById(t.getId());
        found.setAmount(new BigDecimal("400.00"));
        assert findById(t.getId()).getAmount().compareTo(new BigDecimal("400.00")) == 0 : "Update test failed";
        System.out.println("  ✔ Test Update Expense: PASSED");

        // Test Delete
        expenses.remove(found);
        assert expenses.size() == initialSize : "Delete test failed";
        System.out.println("  ✔ Test Delete Expense: PASSED");

        System.out.println("All automated validation checks executed cleanly!\n");
    }

    private static Expense findById(Long id) {
        return expenses.stream().filter(e -> e.getId().equals(id)).findFirst().orElse(null);
    }
}
