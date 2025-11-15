var DATA;
fetch('json_schemas/city_street.json')
    .then((response) => response.json())
    .then((data) => DATA = data);