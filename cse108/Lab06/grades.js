const url = "https://amhep.pythonanywhere.com/grades";

let searchName="";
let newName="";
let newGrade="";
let editName="";
let editGrade="";
let deleteName="";

function search(){
    searchName = document.getElementById("searchFieldFirst").value+"%20"+document.getElementById("searchFieldLast").value;
    console.log("Searching for "+searchName);
    fetch(url+"/"+searchName, {
        method: "GET",
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP Error: "+response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        searchName=Object.keys(data)[0];
        document.getElementById("searchResultName").innerHTML= searchName;
        document.getElementById("searchResultGrade").innerHTML= data[searchName];
        if (document.getElementById("searchResults").hasAttribute("hidden")) {
            document.getElementById("searchResults").removeAttribute("hidden");
        }

      })
    .catch((error) => {
        console.error("Error:", error);
    });
}

function submitNew(){
    newName = document.getElementById("newFieldFirst").value + " " + document.getElementById("newFieldLast").value;
    newGrade = document.getElementById("newFieldGrade").value;

    const newStudent={
        "name": newName,
        "grade": newGrade
    };

    fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newStudent)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP Error: "+response.status);
        }
        document.getElementById("newResults").innerHTML= newName+" Added with grade "+newGrade;
        if (document.getElementById("newResults").hasAttribute("hidden")) {
            document.getElementById("newResults").removeAttribute("hidden");
        }
      })
    .catch((error) => {
        console.error("Error:", error);
    });
}

function searchEdit(){
    editName = document.getElementById("editFieldFirst").value+"%20"+document.getElementById("editFieldLast").value;
    fetch(url+"/"+editName, {
        method: "GET",
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP Error: "+response.status);
        }
        if (document.getElementById("editSection").hasAttribute("hidden")) {
            document.getElementById("editSection").removeAttribute("hidden");
        }
      })
    .catch((error) => {
        console.error("Error:", error);
    });
}

function submitEdit(){
    editName = document.getElementById("editFieldFirst").value+"%20"+document.getElementById("editFieldLast").value;
    editGrade = document.getElementById("editFieldGrade");
    const newEdit={
        "grade": editGrade
    };
    fetch(url+"/"+editName, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEdit)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP Error: "+response.status);
        }
        editName = document.getElementById("editFieldFirst").value+" "+document.getElementById("editFieldLast").value;
        document.getElementById("editResults").innerHTML= editName+" Changed to grade "+newGrade;
        if (document.getElementById("editResults").hasAttribute("hidden")) {
            document.getElementById("editResults").removeAttribute("hidden");
        }
      })
    .catch((error) => {
        console.error("Error:", error);
    });
    
}

function submitDelete(){
    deleteName = document.getElementById("deleteFieldFirst").value+"%20"+document.getElementById("deleteFieldLast").value;
    fetch(url+"/"+deleteName,{method:"DELETE"})
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP Error: "+response.status);
        }
        console.log("Deleting "+deleteName);
        deleteName = document.getElementById("deleteFieldFirst").value+" "+document.getElementById("deleteFieldLast").value;
        document.getElementById("deleteResults").innerHTML= deleteName+" Deleted ";
        if (document.getElementById("deleteResults").hasAttribute("hidden")) {
            document.getElementById("deleteResults").removeAttribute("hidden");
        }
      })
    .catch((error) => {
        console.error("Error:", error);
    });
}

function displayAll(){
    fetch(url, {
        method: "GET",
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP Error: "+response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        let table = document.getElementById("displayResults");
        if (table.hasAttribute("hidden")) {
            table.removeAttribute("hidden");
        }
        table.innerHTML= "<tr><th>Student Name</th><th>Grade</th></tr>";
        for (const key in data) {
            fetch(url+"/"+key,{method:"DELETE"}); //deletes all the spam
            let newRow = table.insertRow();
            let cell1 = newRow.insertCell(0);
            let cell2 = newRow.insertCell(1);
            cell1.innerHTML=key;
            cell2.innerHTML=data[key];
        }
      })
    .catch((error) => {
        console.error("Error:", error);
    });
}