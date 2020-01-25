let payList;
let appearPayed = false;

const init = () => {
    viewPayList();
    sumPaytempValue();
};

const savePayItem = (id, item) => {
    item["value"] = parseInt(item["value"]);
    localStorage.setItem(id, JSON.stringify(item));
};

const loadAllPayItem = (id) => {
    payList = [];
    for(const id in localStorage) {
        if (localStorage.hasOwnProperty(id)) {
            payList[id] = JSON.parse(localStorage.getItem(id));
            payList[id]["value"] = parseInt(payList[id]["value"]); 
            if(payList[id]["date"] == null) {
                const date = new Date(parseInt(id));
                payList[id]["date"] = date.toISOString().substr(0, 10);
            }               
        }
    }
    // payList.sort((a, b) => {
    //     return 1;
    // });
};

const addNewItem = () => {
    const id = Date.now().toString();
    const date = document.getElementById("new_date").value;
    const item = document.getElementById("new_item").value;
    const value = document.getElementById("new_value").value;
    savePayItem(id, {"date": date, "item": item, "value": value, "isPayed": ""});
    init();
};

const newItemHtml = `
    <li class="list-group-item">
        <div class="form-row align-items-center">
            <input type="date" class="form-control form-control-sm col-4 font-small" id="new_date" placeholder="date">
            <input type="text" class="form-control form-control-sm col-4 font-small" id="new_item" placeholder="item">
            <input type="number" class="form-control form-control-sm col-3 font-small" id="new_value" placeholder="price">
            <div class="col-1"><button class="btn btn-primary rounded-circle p-0 form-control form-control-sm" style="width:1.7rem;height:1.7rem;" onclick="addNewItem();">+</button></div>
        </div>
    </li>
`;

const sort_rule = (a, b) => {
    const former = new Date(a.date);
    const later = new Date(b.date);
    return former - later;
};

const sortPayListID = () => {
    const id_list = Object.keys(payList);
    const date_list = [];
    for(const id in payList) {
        date_list.push({"id": id, "date": payList[id]["date"]});
    }
    const sorted = date_list.sort(sort_rule);

    const result = [];
    for (const data of sorted) {
        result.push(data["id"]);
    }
    return result;
} 

const viewPayList = () => {
    loadAllPayItem();
    let liList = [ ];
    for(const id of sortPayListID()) {
        if(!appearPayed && payList[id]["isPayed"] == "checked"){ continue; }
        
        const itemStr = `
        <li class="list-group-item">
            <div class="form-row align-items-center ispayed-${payList[id]["isPayed"]}" id="${id}_line">
                <div class="col-1 form-check"><input type="checkbox" class="form-control form-control-sm form-check-input position-static" id="${id}_isPayed" ${payList[id]["isPayed"]} onchange="switchIsPayed(${id});"></div>
                <input type="date" class="form-control form-control-sm col-4 font-small" id="${id}_date" value="${payList[id]["date"]}" onchange="edit(${id}, 'date')";>
                <input type="text" class="form-control form-control-sm col-4 font-small" id="${id}_item" value="${payList[id]["item"]}" oninput="edit(${id}, 'item')";>
                <input type="number" class="form-control form-control-sm col-2 font-small" id="${id}_value" value="${payList[id]["value"]}" oninput="edit(${id}, 'value')";>
                <div class="col-1"><button class="btn btn-secondary rounded-circle p-0" style="width:1.7rem;height:1.7rem;" onclick="deleteItem(${id}); init();">-</button></div>
            </div>
        </li>
        `;
        liList.push(itemStr);
    }
    liList.push(newItemHtml);
    document.getElementById("payList").innerHTML = liList.join('\n');
};

const switchIsPayed = (id) => {
    if (document.getElementById(`${id}_isPayed`).checked) {
        payList[id]["isPayed"] = "checked";
        document.getElementById(`${id}_line`).classList.add("ispayed-checked");
    }
    else {
        payList[id]["isPayed"] = "";
        document.getElementById(`${id}_line`).classList.remove("ispayed-checked");
    }
    savePayItem(id, payList[id]);
    sumPaytempValue();
};

const edit = (id, target) => {
    payList[id][target] = document.getElementById(`${id}_${target}`).value;
    savePayItem(id, payList[id]);

    if (target == "value") { sumPaytempValue(); }
};

const sumPaytempValue = () => {
    let total = 0;
    for(const id in payList) {
        if(payList[id]["isPayed"] == "") { total += payList[id]["value"]; }
    }
    document.getElementById("total_value").textContent = total;
};

const checkAllIsPayed = () => {
    for(const id in payList) {
        if(payList[id]["isPayed"] == "") {
            payList[id]["isPayed"] = "checked";
            savePayItem(id, payList[id]);
        }
    }
    viewPayList();
    sumPaytempValue();
};

const deleteItem = (id) => {
    delete payList[id];
    localStorage.removeItem(id);
};

const deleteAllPayed = () => {
    for (const id in payList) {
        if(payList[id]["isPayed"] == "checked") {
            deleteItem(id);
        }
    }
    init();
};

const switchAppearPayed = () => {
    appearPayed = !appearPayed;
    init();
};