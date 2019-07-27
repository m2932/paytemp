let payList;
let appearPayed = true;

const init = () => {
    viewPayList();
    sumPaytempValue();
};

const savePayItem = (id, item) => {
    localStorage.setItem(id, JSON.stringify(item));
};

const loadAllPayItem = (id) => {
    payList = {};
    for(let i = 0; i < localStorage.length; i++) {
        const id = localStorage.key(i);
        payList[id] = JSON.parse(localStorage.getItem(id));
    }    
};

const addNewItem = () => {
    const id = Date.now().toString();
    const item = document.getElementById("new_item").value;
    const value = parseInt(document.getElementById("new_value").value, 10);
    savePayItem(id, {"item": item, "value": value, "isPayed": ""});
    viewPayList();
    sumPaytempValue();
};

const newItemHtml = `
    <li class="list-group-item">
        <div class="form-row align-items-center">
            <div class="col-7"><input type="text" class="form-control" id="new_item" placeholder="item"></div>
            <div class="col-3"><input type="number" class="form-control" id="new_value" placeholder="price"></div>
            <div class="col-1"><button class="btn btn-primary rounded-circle p-0 form-control" style="width:2rem;height:2rem;" onclick="addNewItem();">+</button></div>
        </div>
    </li>
`;

const viewPayList = () => {
    loadAllPayItem();
    let liList = [ ];
    for(const id in payList) {
        if(!appearPayed && payList[id]["isPayed"] == "checked"){ continue; }
        
        const itemStr = `
        <li class="list-group-item">
            <div class="form-row align-items-center ispayed-${payList[id]["isPayed"]}" id="${id}_line">
                <div class="col-1 form-check form-check-inline"><input type="checkbox" class="form-control form-check-input" id="${id}_isPayed" ${payList[id]["isPayed"]} onchange="switchIsPayed(${id});"></div>
                <div class="col-6"><input type="text" class="form-control" id="${id}_item" value="${payList[id]["item"]}" oninput="edit(${id}, 'item')";></div>
                <div class="col-3"><input type="number" class="form-control" id="${id}_value" value="${payList[id]["value"]}" oninput="edit(${id}, 'value')";></div>
                <div class="col-1"><button class="btn btn-secondary rounded-circle p-0" style="width:2rem;height:2rem;" onclick="deleteItem(${id}); init();">-</button></div>
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