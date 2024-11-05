// these are helper functions used later in code
function showError(fieldId, message) {
    const errorSpan = document.getElementById(`${fieldId}-error`);
    errorSpan.textContent = message;
    document.getElementById(fieldId).classList.add('error-border');
}

function clearError(fieldId) {
    const errorSpan = document.getElementById(`${fieldId}-error`);
    errorSpan.textContent = '';
    document.getElementById(fieldId).classList.remove('error-border');
}

function validateRequiredFields(type) {
    const requiredFields = document.querySelectorAll('input[required], select[required]');
    switch(type) {
        case 'blur':
            requiredFields.forEach(field => {
                field.addEventListener('blur', function() {
                    if (!field.value.trim()) {
                        showError(field.id, 'Toto pole je povinné!');
                        return 1;
                    } else {
                        clearError(field.id);
                        return 0;
                    }
                });
            });
            break;
        default:
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    showError(field.id, 'Toto pole je povinné!');
                    return 1;
                } else {
                    clearError(field.id);
                    return 0;
                }
            });
    }

}

function ageValidator() {
    const dobField = document.getElementById('dob');
    const ageField = document.getElementById('age');
    if (dobField.value) {
        const dob = new Date(dobField.value);
        const age = calculateAge(dob);
        if (ageField.value != age) {
            showError('age', 'Vek nezodpoveda datumu narodenia');
            return 1;
        }
        else if (ageField.value === age){
            clearError('age');
            return 0;
        }
    }
}

function validFormatOfEmail(email) {
    const atIndex = email.indexOf('@');
    if (!email.trim()) {
        return'Toto pole je povinné!';
    }
    else if (atIndex === -1) {
        return 'Validný email musí obsahovať @.';
    }
    if (atIndex < 3) {
        return 'Pred @ musia byť aspoň 3 znaky.';
    }

    const domainParts = email.slice(atIndex + 1).split('.');
    if (domainParts.length < 2) {
        return 'Validný email má aspoň 2 domény.';
    }

    const tld = domainParts[domainParts.length - 1];
    if (tld.length < 2 || tld.length > 4) {
        return 'TLD musí mať dĺžku 2 až 4 znaky.';
    }

    return '';
}

function emailValidator() {
    const emailField = document.getElementById('email');
    const errorMessage = validFormatOfEmail(emailField.value);
    if (errorMessage) {
        console.log(errorMessage);
        showError(emailField.id, errorMessage);
        return 1;
    } else {
        clearError(emailField.id);
        return 0;
    }
}

function phoneValidator() {
    const phoneField = document.getElementById('phone');
    const phoneRegex = /^\+\d{1,3}\d{4,14}(?:x.+)?$/;
    if (!phoneField.value.trim()) {
        showError(phoneField.id, 'Toto pole je povinné!');
        return 1;
    }
    else if (!phoneRegex.test(phoneField.value)) {
        showError(phoneField.id, 'Prosím zadajte telefónne číslo v medzinárodnom formáte.');
        return 1;
    } else {
        clearError(phoneField.id);
        return 0;
    }
}

function validateTimeFrom() {
    const activityTimeFrom = document.getElementById('time-from');
    const timeFromValue = activityTimeFrom.value;
    const [hoursF, minutesF] = timeFromValue.split(':').map(Number);
    if (hoursF < 6 || (hoursF >= 21 && minutesF > 0)) {
        showError(activityTimeFrom.id, 'Prosím vyberte čas medzi 6:00 a 21:00.');
        return 1;
    } else {
        clearError(activityTimeFrom.id);
        return 0;
    }
}

function validateTimeTo() {
    const activityTimeFrom = document.getElementById('time-from');
    const activityTimeTo = document.getElementById('time-to');
    const timeFromValue = activityTimeFrom.value;
    const [hoursF, minutesF] = timeFromValue.split(':').map(Number);
    const timeToValue = activityTimeTo.value;
    const [hoursT, minutesT] = timeToValue.split(':').map(Number);
    if (hoursF + 1 > hoursT || (hoursF + 1 == hoursT && minutesF > minutesT)) {
        showError(activityTimeTo.id, 'Minimálny čas na objednávku je 1hod.');
        return 1;
    } else {
        clearError(activityTimeTo.id);
        console.log(parseFloat(document.getElementById('sport').selectedOptions[0].getAttribute('data-price')));
        calculatePriceForCourt(document.getElementById('sport').selectedOptions[0].getAttribute('data-price'));
        return 0;
    }
}

function calculateAge(dob) {
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
}

function updateRemainingCharacters(inputId, remainingId) {
    const input = document.getElementById(inputId);
    const remaining = document.getElementById(remainingId);

    input.addEventListener('input', function() {
        const maxLength = input.getAttribute('maxlength');
        const currentLength = input.value.length;
        remaining.textContent = (maxLength - currentLength) + '/' + maxLength;
    });
}

function showOneArea(checkbox, textarea) {
    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            textarea.style.display = 'block';
        } else {
            textarea.style.display = 'none';
        }
    });
}

function changeOptDisplay(options, attr, attrVal) {
    options.forEach(option => {
        if (option.getAttribute(attr) == attrVal) {
            option.style.display = 'block'
        } else {
            option.style.display = 'none'
        }
    });
}

function updateEquipmentOptions(sport) {
    const equipmentDiv = document.getElementById('equipment-list');
    const equipmentList = equipmentDiv.querySelectorAll('div');
    changeOptDisplay(equipmentList, 'data-for-sport', sport);
}



function calculatePriceForCourt(priceForHour) {
    const activityTimeFrom = document.getElementById('time-from');
    const activityTimeTo = document.getElementById('time-to');
    const priceSpan = document.getElementById('price');
    const priceSpanAttr = priceSpan.getAttribute('data-price-for-court');
    const [hoursF, minutesF] = activityTimeFrom.value.split(':').map(Number);
    const [hoursT, minutesT] = activityTimeTo.value.split(':').map(Number)
    hour = (hoursT - hoursF) + (Math.abs(minutesT - minutesF) / 60);

    if (activityTimeFrom.value === "" || activityTimeTo.value === ""){
        priceSpan.textContent = parseFloat(priceSpan.textContent) - parseFloat(priceSpanAttr) + (priceForHour * 1);
        priceSpan.setAttribute('data-price-for-court', (priceForHour * 1));
    } else if (parseFloat(priceSpan.textContent) >= priceForHour) {
        console.log('hi');
        priceSpan.textContent = parseFloat(priceSpan.textContent) - parseFloat(priceSpanAttr) + (priceForHour * hour);
        priceSpan.setAttribute('data-price-for-court', (priceForHour * hour));
    } else {
        priceSpan.textContent = parseFloat(priceSpan.textContent) - parseFloat(priceSpanAttr) + (priceForHour * hour);
        priceSpan.setAttribute('data-price-for-court', (priceForHour * hour));
    }

}

// EO helper functions

function addDobListener() {
    const dobField = document.getElementById('dob');
    const ageField = document.getElementById('age');
    const today = new Date().toISOString().split('T')[0];
    dobField.setAttribute('max', today);

    dobField.addEventListener('change', function() {
        if (dobField.value) {
            const dob = new Date(dobField.value);
            ageField.value = calculateAge(dob);
        }
    });
}

function handleSportAndCourtSelection() {
    const cardType = document.getElementById('discount');
    const sportType = document.getElementById('sport');
    const courtType = document.getElementById('court-type');
    const priceSpan = document.getElementById('price');


    cardType.addEventListener("change", function () {
        const sportSelect = document.getElementById("select-sport");
        const allOptionsSport = sportSelect.querySelectorAll("option[data-allowed-for]");
        sportType.selectedIndex = 0;
        sportSelect.style.display = 'block';
        changeOptDisplay(allOptionsSport, 'data-allowed-for',cardType.value);
    });

    sportType.addEventListener("change", function(){
        const courtSelect = document.getElementById("courts");
        const allOptionsCourt = courtSelect.querySelectorAll("option");
        document.getElementById("court-type").selectedIndex = 0;
        courtSelect.style.display = 'block';
        updateEquipmentOptions(sportType.value);

        calculatePriceForCourt(parseFloat(sportType.selectedOptions[0].getAttribute('data-price')));
        changeOptDisplay(allOptionsCourt, 'data-allowed-for',cardType.value);
        allOptionsCourt.forEach(option => {
            if (option.getAttribute('data-for-sport') != sportType.value) {
                option.style.display = 'none'
            }
        });
    });

    courtType.addEventListener("change", function (){
        priceSpan.textContent = parseFloat(priceSpan.textContent) + parseFloat(courtType.selectedOptions[0].getAttribute('data-price'));
    });
}

function handleEquipmentSelection() {
    const borrowEquipmentRadio = document.getElementById('borrow-equipment');
    const noEquipmentRadio = document.getElementById('no-equipment');
    const equipmentDiv = document.getElementById('equipment-list');
    const equipmentCheck = equipmentDiv.querySelectorAll('input[type="checkbox"]');
    const priceSpan = document.getElementById('price');

    borrowEquipmentRadio.addEventListener('change', function() {
        if (borrowEquipmentRadio.checked) {
            equipmentDiv.style.display = 'block';
        }
    });
    noEquipmentRadio.addEventListener('change', function() {
        if (noEquipmentRadio.checked) {
            equipmentDiv.style.display = 'none';
        }
    });

    equipmentCheck.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
                priceSpan.textContent = parseFloat(priceSpan.textContent) + parseFloat(checkbox.getAttribute('data-price'));
            } else {
                priceSpan.textContent = parseFloat(priceSpan.textContent) - parseFloat(checkbox.getAttribute('data-price'));
            }
        });
    });

}

function setMinDate(){
    const activityDate = document.getElementById('activity-date');
    // Set the minimum date to today
    const today = new Date().toISOString().split('T')[0];
    activityDate.setAttribute('min', today);
}

function remainingCharsUpdateAll() {
    updateRemainingCharacters('name', 'name-remaining');
    updateRemainingCharacters('surname', 'surname-remaining');
    updateRemainingCharacters('email', 'email-remaining');
    updateRemainingCharacters('phone', 'phone-remaining');
    updateRemainingCharacters('other-textarea', 'other-textarea-remaining');
}

function showTextAreas() {
    const infoCheckbox = document.getElementById('info');
    const infoTextarea = document.getElementById('author-info');
    const otherCheckbox = document.getElementById('other-requirements');
    const otherTextarea = document.getElementById('other-textarea');
    const otherTextRemaining = document.getElementById('other-textarea-remaining');

    showOneArea(infoCheckbox, infoTextarea);
    showOneArea(otherCheckbox, otherTextarea);
    showOneArea(otherCheckbox, otherTextRemaining);
}

function validateAllFields() {
    const ageField = document.getElementById('age');
    ageField.addEventListener('change', ageValidator);
    const emailField = document.getElementById('email');
    emailField.addEventListener('blur', emailValidator);
    const phoneField = document.getElementById('phone');
    phoneField.addEventListener('blur', phoneValidator);
    const activityTimeFrom = document.getElementById('time-from');
    const activityTimeTo = document.getElementById('time-to');
    activityTimeFrom.addEventListener('input', validateTimeFrom);
    activityTimeTo.addEventListener('input', validateTimeTo);
}

function addInfoToParagraph() {
    const personalInfoParagraph = document.getElementById("personal-info");
    const serviceInfoParagraph = document.getElementById("service-info");
    const priceHeading = document.getElementById("final-price");
    let checkedValues = [];

    // Convert NodeList to an array and use forEach to iterate through checkboxes
    Array.from(document.getElementsByName('equipment')).forEach(function(element) {
        if (element.checked) { // Only include checked checkboxes
            checkedValues.push(element.value); // Add the value to the array
            console.log(element.textContent)
        }
    });

    let commaSeparatedCheckedValues = checkedValues.join(', '); // Join checked values with commas
    personalInfoParagraph.innerHTML = `
            Meno: ${document.getElementById('name').value} ${document.getElementById('surname').value} <br>
            Email: ${document.getElementById('email').value} <br>
            Telefónne číslo: ${document.getElementById('phone').value}
        `;

    serviceInfoParagraph.innerHTML = `
            Zľava: ${document.getElementById('discount').selectedOptions[0].textContent} <br>
            Šport: ${document.getElementById('sport').selectedOptions[0].textContent} <br>
            Typ ihriska: ${document.getElementById('court-type').selectedOptions[0].textContent} <br>
            Dátum: ${document.getElementById('activity-date').value} <br>
            Čas: ${document.getElementById('time-from').value} - ${document.getElementById('time-to').value} <br>
            Zapožičané vybavenie: ${commaSeparatedCheckedValues}
        `;
    priceHeading.innerText = `${document.getElementById('price').textContent}€`
}


function showModal() {
    const submitButton = document.querySelector("input[type='submit']");
    submitButton.addEventListener('click', function () {
        if(validateRequiredFields() || ageValidator() || validateTimeFrom() || validateTimeTo() || phoneValidator() || emailValidator()){
            validateRequiredFields();
            ageValidator();
            validateTimeFrom();
            validateTimeTo();
            phoneValidator();
            emailValidator();
            event.preventDefault();
        } else {
            event.preventDefault(); // Prevent the default form submission
            console.log('Form submitted');
            document.getElementById('orderModal').style.display = 'block';
            addInfoToParagraph();
            document.body.style.overflow = 'hidden';
            finalSubmit();
            cancelModal();
        }
    });
}

function cancelModal() {
    const cancelButton = document.getElementById('cancelOrder');
    cancelButton.addEventListener('click', function () {
        document.getElementById('orderModal').style.display = 'none';
        event.preventDefault();
        document.body.style.overflow = 'auto';
    })
}

function finalSubmit() {
    const confirmButton = document.getElementById('confirmOrder');
    confirmButton.addEventListener('click', function () {
        document.getElementById('orderModal').style.display = 'none';
    })
}

console.log('DOM is fully loaded and parsed');
handleSportAndCourtSelection();
handleEquipmentSelection();
validateRequiredFields('blur');
validateAllFields();
addDobListener();
setMinDate();
showTextAreas();
remainingCharsUpdateAll();
showModal();
