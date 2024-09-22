export const finishOrder = (
  groupedOrder,
  orderAllergy,
  tableNum,
  paymentMethod,
  total,
  orderId,
  emp_name = localStorage.getItem("user_dets").name,
  paid = true
) => {
  let order = {
    contents: groupedOrder,
    allergies: orderAllergy,
    time: new Date(),
    paid: paid,
    payment_method: paymentMethod,
    table_no: tableNum,
    order_id: orderId,
    emp_name: emp_name,
    total: total,
  };
  console.log(order);

  const url = "http://localhost:8000/order/create-order/";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Order created successfully:", data);
    })
    .catch((error) => {
      console.error("Error creating order:", error);
    });
};

export const getSubMenu = (menu, subRoute, setSubMenu, setBreadcrumbs) => {
  let subMenuTemp = menu;

  const routeParts = subRoute.split("/").filter((part) => part); // Split and filter out empty strings
  setBreadcrumbs(["home", ...routeParts]);
  for (const part of routeParts) {
    if (subMenuTemp[part]) {
      subMenuTemp = subMenuTemp[part];
    } else {
      // If the route part doesn't exist in the menu, return an empty object or handle the error as needed
      return {};
    }
  }
  setSubMenu(subMenuTemp);
  if (Array.isArray(subMenuTemp)) {
    // If the subMenu is an array, return it as it is
    return subMenuTemp;
  } else {
    // If subMenu is an object, return its keys
    return Object.keys(subMenuTemp);
  }
};

export const getData = (location, setSubMenu, setBreadcrumbs, setMenu) => {
  fetch("/menu.json", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then(async function (response) {
    let res = await response.json();
    // setCompleteMenu(res);
    const currentPath = location.pathname.replace("/menu", ""); // Remove the base path

    let tempVal = getSubMenu(res.menu, currentPath, setSubMenu, setBreadcrumbs);
    setMenu(tempVal);
  });
};

export const addToOrder = (item, groupedOrder, setGroupedOrder) => {
  let order = [...groupedOrder];
  let found = false;

  order.forEach((orderItem) => {
    if (orderItem["item_name"] === item.item_name) {
      orderItem["count"] += 1;
      found = true;
    }
  });
  if (!found) {
    const newItem = { ...item, count: 1, message: "", prepared: false };
    order = [newItem].concat(groupedOrder);
  }

  setGroupedOrder(order);
  localStorage.setItem("grouped_order", JSON.stringify(order));
};

export const handleDelete = (item_name, groupedOrder, setGroupedOrder) => {
  let newOrder = groupedOrder.filter((item) => item.item_name !== item_name);
  setGroupedOrder(newOrder);
  localStorage.setItem("grouped_order", JSON.stringify(newOrder));
};

export const removeOnceFromOrder = (item, groupedOrder, setGroupedOrder) => {
  let order = [...groupedOrder];

  order.forEach((orderItem) => {
    if (orderItem["item_name"] === item.item_name) {
      if (orderItem["count"] == 1) {
        handleDelete(orderItem["item_name"], groupedOrder, setGroupedOrder);
        return;
      } else {
        orderItem["count"] -= 1;
        setGroupedOrder(order);
        localStorage.setItem("grouped_order", JSON.stringify(groupedOrder));
        return;
      }
    }
  });
};

export const handleTableChange = (val, setTableNum, setTableModalOpen) => {
  setTableNum(val);
  setTableModalOpen(false);
};

export const handleAddMessage = (
  item,
  message,
  groupedOrder,
  setGroupedOrder
) => {
  let order = [...groupedOrder];

  order.forEach((orderItem) => {
    if (orderItem["item_name"] === item.item_name) {
      orderItem["message"] = message;
    }
  });

  setGroupedOrder(order);
  localStorage.setItem("grouped_order", JSON.stringify(groupedOrder));
};
