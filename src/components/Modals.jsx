import React from "react";

const Modals = ({
  modalOpen,
  handleTableChange,
  orderAllergy,
  setOrderAllergy,
  setAllergiesOption,
  allergiesOption,
}) => {
  return (
    <>
      {modalOpen && (
        <div className=' absolute top-0 bottom-0 left-0 right-0 bg-slate-500 bg-opacity-60 z-50 flex items-center justify-center'>
          <div className=' bg-white min-w-3/12 aspect-square flex flex-col items-center justify-start py-8 space-y-5 px-5 max-h-screen overflow-scroll'>
            <p className=' text-xl font-semibold'>Select a table</p>
            <div className=' grid grid-cols-5 gap-4'>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((val) => (
                <div
                  className='bg-white px-2 py-1 min-w-20 aspect-square flex items-center justify-center border cursor-pointer'
                  onClick={() => handleTableChange(val)}>
                  {val}
                </div>
              ))}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((val) => (
                <div
                  className='bg-white px-2 py-1 min-w-20 aspect-square flex items-center justify-center border cursor-pointer'
                  onClick={() => handleTableChange(val)}>
                  {val}
                </div>
              ))}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((val) => (
                <div
                  className='bg-white px-2 py-1 min-w-20 aspect-square flex items-center justify-center border cursor-pointer'
                  onClick={() => handleTableChange(val)}>
                  {val}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {allergiesOption && (
        <div className=' absolute top-0 bottom-0 left-0 right-0 bg-slate-500 bg-opacity-60 z-50 flex items-center justify-center'>
          <div className=' relative bg-white min-w-4/12 aspect-square flex flex-col items-center justify-start py-8 space-y-5 px-5 max-h-screen overflow-scroll'>
            <p className=' text-xl font-semibold'>Allergy?</p>
            <div className=' grid grid-cols-5 gap-4'>
              {[
                "none",
                "milk",
                "eggs",
                "fish",
                "shellfish",
                "tree nuts",
                "peanuts",
                "wheat",
                "soybeans",
              ].map((val) => (
                <div
                  className={` px-2 py-1 min-w-20 aspect-square flex items-center justify-center border cursor-pointer ${
                    orderAllergy.includes(val) ? "bg-green-400" : "bg-white"
                  }`}
                  onClick={() => {
                    if (val === "none") {
                      setOrderAllergy([]);
                      setAllergiesOption(false);
                    } else {
                      if (orderAllergy.includes(val)) {
                        let currAllergies = [...orderAllergy];
                        console.log(
                          currAllergies.filter((allergy) => allergy !== val)
                        );
                        setOrderAllergy(
                          currAllergies.filter((allergy) => allergy !== val)
                        );
                      } else {
                        let currAllergies = [...orderAllergy];
                        currAllergies.push(val);
                        setOrderAllergy(currAllergies);
                      }
                    }
                  }}>
                  {val}
                </div>
              ))}
            </div>
            <div
              className=' bg-red-400 absolute bottom-5 px-5 py-4 '
              onClick={() => setAllergiesOption(false)}>
              Close
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modals;
