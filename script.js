body {
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
  background: #fff;
  color: #333;
}

.hero {
  background: url('images/background.jpg') no-repeat center center/cover;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-shadow: 2px 2px 4px #000;
}

.gallery {
  padding: 2rem;
  text-align: center;
}

.cube-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.cube-grid img {
  width: 100%;
  border-radius: 8px;
  transition: transform 0.3s;
}

.cube-grid img:hover {
  transform: scale(1.05);
}

.booking {
  padding: 2rem;
  background: #f7f7f7;
  text-align: center;
}

.booking form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: auto;
}

.booking input, .booking select, .booking button {
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #aaa;
  border-radius: 5px;
}

.booking button {
  background: black;
  color: white;
  cursor: pointer;
}

footer {
  text-align: center;
  padding: 1rem;
  background: #222;
  color: white;
}
