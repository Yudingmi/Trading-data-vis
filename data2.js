async function loadData() {
  const ids = [71639, 80045, 280492, 280596, 290491];

  let memberArr = [];

  let xchgArr = [];
  let otcArr = [];
  let walletArr = [];
  let loginArr = [];

  for (let id of ids) {
    let data = await fetch(`./data/${id}.json`).then(resp => resp.json()).then(data => data.data);

    memberArr.push({
      id: id,
      name: data.realName,
      country: data.country,
      phone: data.mobilePhone,
      email: data.email,
      memberLevel: data.memberLevel
    });

    for (let e of data.exchangeOrders) {
      e2 = {};
      e2.memberId = id;
      e2.baseSymbol = e.baseSymbol;
      e2.amount = e.tradedAmount;
      e2.direction = +e.direction;
      e2.time = e.time == null ? null : new Date(e.time);
      e2.completedTime = e.completedTime == null ? null : new Date(e.completedTime);
      xchgArr.push(e2);
    }

    for (let e of data.otcOrders) {
      let e2 = {};
      e2.memberId = id;
      e2.money = e.money;
      e2.createTime = e.createTime == null ? null : new Date(e.createTime);
      e2.releaseTime = e.releaseTime == null ? null : new Date(e.releaseTime);
      e2.unit = e.unit;
      otcArr.push(e2);
    }

    for (let e of data.memberWalletHistorys) {
      let e2 = {};
      e2.memberId = id;
      e2.amount = e.amount;
      e2.opTime = e.opTime == null ? null : new Date(e.opTime);
      e2.unit = e.unit;
      walletArr.push(e2);
    }

    for (let e of data.memberLoginHistorys) {
      let e2 = {};
      e2.memberId = id;
      e2.loginTime = e.loginTime == null ? null : new Date(e.loginTime);
      e2.loginIp = e.loginip;
      e2.ipToMemberIds = e.ipToMemberIds;
      loginArr.push(e2);
    }
  }

  let xchgMap = new Map();
  for (let e of xchgArr) {
    let arrValue = xchgMap.get(e.memberId);
    if (arrValue) {
      arrValue.push(e);
      xchgMap.set(e.memberId, arrValue);
    } else {
      xchgMap.set(e.memberId, [e]);
    }
  }

  let otcMap = new Map();
  for (let e of otcArr) {
    let arrValue = otcMap.get(e.memberId);
    if (arrValue) {
      arrValue.push(e);
      otcMap.set(e.memberId, arrValue);
    } else {
      otcMap.set(e.memberId, [e]);
    }
  }

  let walletMap = new Map();
  for (let e of walletArr) {
    let arrValue = walletMap.get(e.memberId);
    if (arrValue) {
      arrValue.push(e);
      walletMap.set(e.memberId, arrValue);
    } else {
      walletMap.set(e.memberId, [e]);
    }
  }

  let loginMap = new Map();
  for (let e of loginArr) {
    let arrValue = loginMap.get(e.memberId);
    if (arrValue) {
      arrValue.push(e);
      loginMap.set(e.memberId, arrValue);
    } else {
      loginMap.set(e.memberId, [e]);
    }
  }

  return { memberArr, xchgMap, otcMap, walletMap, loginMap };
}
