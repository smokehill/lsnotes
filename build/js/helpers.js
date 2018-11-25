export function lsGet(key)
{
    var data = JSON.parse(localStorage.getItem(key));

    return (data != null ) ? data : null;
}

export function lsSet(key, value)
{
    localStorage.setItem(key, JSON.stringify(value));
}

export function setId() {
  return Math.floor(Date.now() / 1000);
};

export function setDate() {
  return new Date().toISOString().slice(0,10);
};

