const getEmployees = async () => {
  const empData = await fetch("http://localhost:8000/employee/get-employees");
  return empData.json();
};

module.exports = {
  getEmployees,
};
