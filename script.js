// ENTER KEY MOVES TO NEXT FIELD
function moveNext(event, nextField) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById(nextField).focus();
    }
}

// SUBMIT SUGGESTION
function submitSuggestion() {
    let id = document.getElementById("id").value.trim();
    let name = document.getElementById("name").value.trim();
    let classSection = document.getElementById("classSection").value.trim();
    let category = document.getElementById("category").value;
    let suggestion = document.getElementById("suggestion").value.trim();
    let msg = document.getElementById("msg");

    let suggestions = JSON.parse(localStorage.getItem("suggestions")) || [];

    // Blank check
    if (!id || !name || !classSection || !suggestion) {
        msg.innerHTML = "All fields are required!";
        msg.style.color = "red";
        return;
    }

    // Meaningless suggestion
    if (suggestion.length < 5 || !suggestion.match(/[a-zA-Z]/) || !suggestion.includes(" ")) {
        msg.innerHTML = "Invalid suggestion!";
        msg.style.color = "red";
        return;
    }

    // Duplicate ID check
    if (suggestions.some(s => s.id === id)) {
        msg.innerHTML = "Duplicate Student ID!";
        msg.style.color = "red";
        return;
    }

    let data = {id, name, classSection, category, suggestion};
    suggestions.push(data);
    localStorage.setItem("suggestions", JSON.stringify(suggestions));

    msg.innerHTML = "Suggestion saved successfully!";
    msg.style.color = "green";

    // Clear form
    document.getElementById("id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("classSection").value = "";
    document.getElementById("category").selectedIndex = 0;
    document.getElementById("suggestion").value = "";
}

// ADMIN LOGIN
function adminLogin() {
    let password = prompt("Enter Admin Password:");
    if (password === "admin123") {
        alert("Admin Access Granted");
        document.getElementById("exportBtn").style.display = "inline-block";
    } else {
        alert("Access Denied!");
    }
}

// EXPORT SUGGESTIONS TO CSV
function exportSuggestions() {
    let suggestions = JSON.parse(localStorage.getItem("suggestions")) || [];

    if (suggestions.length === 0) {
        alert("No suggestions to export");
        return;
    }

    // Optional: filter by category before export
    let category = prompt("Enter category to export (or leave blank for all):");
    let filtered = category ? suggestions.filter(s => s.category.toLowerCase() === category.toLowerCase()) : suggestions;

    if (filtered.length === 0) {
        alert("No suggestions found for this category");
        return;
    }

    // CSV Header
    let csvContent = "Student ID,Student Name,Class,Category,Suggestion\n";

    // Add suggestions
    filtered.forEach(s => {
        let text = s.suggestion.replace(/"/g, '""'); // escape quotes
        csvContent += `${s.id},"${s.name}","${s.classSection}","${s.category}","${text}"\n`;
    });

    // Download CSV
    let blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "SuggestionsReport.csv";
    link.click();
}