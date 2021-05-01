import { useState } from "react";

export default function Home() {
  let retryCount = 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    message: "",
    error: "",
  });

  const handleChange = (event) => {
    setState((value) => ({
      ...value,
      [event.target.name]: event.target.value,
    }));
  };

  const submitHandler = async () => {
    setIsSubmitting(true);

    try {
      let response = await fetch("http://localhost:3001/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
        },
        body: JSON.stringify(state),
      });
      let res = await response.json();
      setState((value) => ({
        ...value,
        error: "",
        message: res.message,
      }));
      setIsSubmitting(false);
    } catch (err) {
      if (retryCount <= 4) {
        retryCount++;
        console.log("Retrying: " + retryCount);
        setTimeout(submitHandler, 5000);
      } else {
        setIsSubmitting(false);
        setState((value) => ({
          ...value,
          message: "",
          error: "Please Try Again Later...",
        }));
      }
    }
  };

  return (
    <>
      <div className={isModalOpen ? "container fade" : "container"}>
        <div className="top-header">
          <p className="logo">SS</p>
          <p className="sub-heading"> sandeep studio</p>
        </div>
        <div className="main-content">
          <h1 className="hero-text top-text">moto</h1>
          <img src="/1.png" alt="" />
          <h1 className="hero-text bottom-text">riders</h1>
          <div className="feature">
            <div>
              <p className="feature-title">Engine</p>
              <p className="feature-value">
                250cc liquid-cooled 4-stroke, 4 volves
              </p>
            </div>
            <div>
              <p className="feature-title">Suspension</p>
              <p className="feature-value">KYB Speed-Sensetive inverted fork</p>
            </div>
            <div>
              <p className="feature-title">Trail</p>
              <p className="feature-value">4.7 in</p>
            </div>
            <div>
              <p className="feature-title">Speed</p>
              <p className="feature-value">100Kmph</p>
            </div>
          </div>
        </div>

        <div className="order-now">
          <button onClick={() => setIsModalOpen(true)}>Order Now</button>
        </div>
      </div>

      {isModalOpen ? (
        <div className="modal">
          <div className="modal-header">
            <h3>Please Fill The Form</h3>
            <button
              onClick={() => {
                setIsModalOpen(false);
                setState((value) => ({ ...value, message: "", error: "" }));
              }}
            >
              X
            </button>
          </div>
          <div className="modal-content">
            <p className={state.message ? "green" : "red"}>
              {state.message ? state.message : state.error}
            </p>
            <br />
            <label htmlFor="firstname">First Name</label> <br />
            <input
              type="text"
              name="firstname"
              value={state.firstname}
              onChange={handleChange}
            />{" "}
            <br />
            <label htmlFor="lastname">Last Name</label> <br />
            <input
              type="text"
              name="lastname"
              value={state.lastname}
              onChange={handleChange}
            />{" "}
            <br />
            <label htmlFor="phone">Phone</label> <br />
            <input
              type="text"
              name="phone"
              value={state.phone}
              onChange={handleChange}
            />{" "}
            <br />
            <label htmlFor="email">Email</label> <br />
            <input
              type="email"
              name="email"
              value={state.email}
              onChange={handleChange}
            />
            <button onClick={submitHandler}>
              {isSubmitting ? <div className="loader"></div> : "Submit"}
            </button>
            <br />
          </div>
        </div>
      ) : null}
    </>
  );
}
