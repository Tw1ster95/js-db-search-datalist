class SearchField {
    constructor({
        id = null,
        dataFile = null,
        maxResults = 10,
        onChangeWait = 400,
        onResultSelectAction = () => {},
        resultsRecieved = () => {},
        error = () => {}
    }) {
        if(!id) return;
        this.field = document.getElementById(id);
        if(!this.field) return;
        this.dataFile = dataFile;
        if(!this.dataFile) return;
        this.field.setAttribute('autocomplete', 'off');
        this.field.setAttribute('list', `${id}List`);
        this.maxResults = maxResults;
        this.onChangeWait = onChangeWait;
        this.timeout = null;
        this.onResultSelectAction = onResultSelectAction;
        this.resultsRecieved = resultsRecieved;
        this.error = error;
        this.generateDataList();
        this.field.addEventListener('input', this.onInput);
    }

    generateDataList = () => {
        this.datalist = document.createElement('datalist');
        this.datalist.classList.add('dropdown-box');
        this.datalist.id = this.field.getAttribute('list');
        this.field.after(this.datalist);
    }

    onInput = (e) => {
        if(e.inputType) {
            if(this.timeout) clearTimeout(this.timeout);
            this.timeout = setTimeout(this.getSearchData, this.onChangeWait);
        }
        else {
            this.onResultSelectAction(this.field, e.currentTarget.value);
        }
    }

    getSearchData = async () => {
        this.timeout = null;
        const text = this.field.value;
        if(!text || text.length < 1) {
            this.resultsRecieved({
                data: [],
                text: text
            });
            this.appendDropdownResults([]);
            return;
        }
        const fd = new FormData();
        fd.append('limit', this.maxResults);
        fd.append('search_text', text);

        const response = await fetch(this.dataFile, {
            method: 'POST',
            body: fd
        });
        if(!response) return;
        try {
            const json = await response.json();
            this.resultsRecieved({
                data: json,
                text: text
            });
            this.appendDropdownResults(json);
        }
        catch(err) {
            this.error(err);
        }
    }

    appendDropdownResults = (results) => {
        this.datalist.innerHTML = '';
        if(!results.length) return;
        let option;
        results.forEach(r => {
            option = document.createElement('option');
            option.label = r;
            option.value = r;
            this.datalist.append(option);
        });
    }
}