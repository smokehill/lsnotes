export function lsGet(key)
{
    var data = JSON.parse(localStorage.getItem(key));

    return (data != null ) ? data : null;
}

export function lsSet(key, value)
{
    localStorage.setItem(key, JSON.stringify(value));
}