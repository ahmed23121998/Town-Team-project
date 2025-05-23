import React, { useContext, useEffect, useState } from "react";
import "./FilterTheProducts.css";
import { MyContext } from "../../Context/FilterContaext";

const defaultAvailabilityFilters = {
  inStock: false,
  outOfStock: false,
};

const defaultPriceRange = {
  min: 0,
  max: 2999,
};

const defaultBrandFilters = {
  cuba: false,
  rivernine: false,
  townteam: false,
};

const defaultSizeFilters = {
  XS: false,
  S: false,
  S2: false,
  M: false,
  L: false,
  XL: false,
  "2XL": false,
  "3XL": false,
  "4XL": false,
  "5XL": false,
  "6XL": false,
};

const defaultColorFilters = {
  red: false,
  green: false,
  darkteal: false,
};

function FilterComponent() {
  const { Filteration, setFilteration } = useContext(MyContext);
  const [expanded, setExpanded] = useState({
    availability: true,
    price: true,
    brand: true,
    size: true,
    color: true,
  });

  const [availabilityFilters, setAvailabilityFilters] = useState(
    defaultAvailabilityFilters
  );
  const [priceRange, setPriceRange] = useState(defaultPriceRange);
  const [brandFilters, setBrandFilters] = useState(defaultBrandFilters);
  const [sizeFilters, setSizeFilters] = useState(defaultSizeFilters);
  const [colorFilters, setColorFilters] = useState(defaultColorFilters);
  const [filterlist, setfilterList] = useState([]);

  function handleFilterList(checked, name) {
    if (checked) {
      setfilterList((prev) => [...prev, name]);
    } else {
      setfilterList((prev) => prev.filter((item) => item !== name));
    }
  }

  function toggleSection(section) {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }

  function handleAvailabilityChange(name, checked) {
    setAvailabilityFilters((prev) => ({
      ...prev,
      [name]: checked,
    }));
    handleFilterList(checked, name);
  }

  function handlePriceChange(e, type) {
    const value = parseInt(e.target.value);
    setPriceRange((prev) => ({
      ...prev,
      [type]: value,
    }));
  }

  function handleBrandChange(name, checked) {
    const normalizedBrand = name.toLowerCase().replace(/\s+/g, "");
    setBrandFilters((prev) => ({
      ...prev,
      [normalizedBrand]: checked,
    }));
    handleFilterList(checked, normalizedBrand);
  }

  function handleSizeChange(size) {
    setSizeFilters((prev) => ({
      ...prev,
      [size]: !prev[size],
    }));
    handleFilterList(!sizeFilters[size], size);
  }

  function handleColorChange(color) {
    const normalizedColor = color.toLowerCase().replace(/\s+/g, "");
    setColorFilters((prev) => ({
      ...prev,
      [normalizedColor]: !prev[normalizedColor],
    }));
    handleFilterList(!colorFilters[normalizedColor], normalizedColor);
  }

  useEffect(() => {
    const filterData = {
      availability: availabilityFilters,
      price: priceRange,
      brand: brandFilters,
      size: sizeFilters,
      color: colorFilters,
    };
    setFilteration(filterData);
  }, [
    availabilityFilters,
    priceRange,
    brandFilters,
    sizeFilters,
    colorFilters,
    setFilteration,
  ]);

  const colorStyles = {
    White: "#FFFFFF",
    Orange: "#FFA500",
    red: "#FF0000",
    Grey: "#808080",
    black: "#000000",
    green: "#008000",
    blue: "#0000FF",
    // الألوان الأصلية
  };

  function ClearFilter() {
    setAvailabilityFilters(defaultAvailabilityFilters);
    setPriceRange(defaultPriceRange);
    setBrandFilters(defaultBrandFilters);
    setSizeFilters(defaultSizeFilters);
    setColorFilters(defaultColorFilters);
    setfilterList([]);
  }

  return (
    <>
      <div
        style={{
          width: "300px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          marginLeft: "0 ",
        }}
      >
        <h3>Selected Filters:</h3>
        {filterlist.length > 0 && (
          <div className="filter-list-container">
            <ul>
              {filterlist.map((item, index) => (
                <li key={index} className="item-list">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button onClick={ClearFilter}>Clear</button>

        <div className="filter-container">
          <div className="filter-section">
            <div
              className="filter-header"
              onClick={() => toggleSection("availability")}
            >
              <div className="filter-title">AVAILABILITY</div>
              <div className="filter-arrow">
                {expanded.availability ? "∧" : "∨"}
              </div>
            </div>
            <div className="filter-divider"></div>
            {expanded.availability && (
              <div className="filter-content">
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="inStock"
                    className="filter-checkbox"
                    checked={availabilityFilters.inStock}
                    onChange={(e) =>
                      handleAvailabilityChange("inStock", e.target.checked)
                    }
                  />
                  <label htmlFor="inStock" className="checkbox-label">
                    In Stock (2479)
                  </label>
                </div>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="outOfStock"
                    className="filter-checkbox"
                    checked={availabilityFilters.outOfStock}
                    onChange={(e) =>
                      handleAvailabilityChange("outOfStock", e.target.checked)
                    }
                  />
                  <label htmlFor="outOfStock" className="checkbox-label">
                    Out Of Stock (1585)
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="filter-section">
            <div
              className="filter-header"
              onClick={() => toggleSection("price")}
            >
              <div className="filter-title">PRICE</div>
              <div className="filter-arrow">{expanded.price ? "∧" : "∨"}</div>
            </div>
            <div className="filter-divider"></div>
            {expanded.price && (
              <div className="filter-content">
                <div className="price-range-container">
                  <input
                    type="range"
                    min="0"
                    max="2999"
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange(e, "min")}
                    className="price-slider"
                  />
                  <div className="price-inputs">
                    <span>EGP {priceRange.min}</span>
                    <span>to</span>
                    <span>EGP {priceRange.max}</span>
                  </div>
                  <button className="apply-button">APPLY</button>
                </div>
              </div>
            )}
          </div>

          <div className="filter-section">
            <div
              className="filter-header"
              onClick={() => toggleSection("brand")}
            >
              <div className="filter-title">BRAND</div>
              <div className="filter-arrow">{expanded.brand ? "∧" : "∨"}</div>
            </div>
            <div className="filter-divider"></div>
            {expanded.brand && (
              <div className="filter-content">
                {Object.entries({
                  cuba: "Cuba",
                  rivernine: "River Nine",
                  townteam: "Town Team",
                }).map(([key, label]) => (
                  <div key={key} className="checkbox-container">
                    <input
                      type="checkbox"
                      id={key}
                      className="filter-checkbox"
                      checked={brandFilters[key]}
                      onChange={(e) => handleBrandChange(key, e.target.checked)}
                    />
                    <label htmlFor={key} className="checkbox-label">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="filter-section">
            <div
              className="filter-header"
              onClick={() => toggleSection("size")}
            >
              <div className="filter-title">SIZE</div>
              <div className="filter-arrow">{expanded.size ? "∧" : "∨"}</div>
            </div>
            <div className="filter-divider"></div>
            {expanded.size && (
              <div className="filter-content">
                <div className="size-buttons-container">
                  {Object.keys(sizeFilters).map((size) => (
                    <button
                      key={size}
                      className={`size-button ${
                        sizeFilters[size] ? "selected" : ""
                      }`}
                      onClick={() => handleSizeChange(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="filter-section">
            <div
              className="filter-header"
              onClick={() => toggleSection("color")}
            >
              <div className="filter-title">COLOR</div>
              <div className="filter-arrow">{expanded.color ? "∧" : "∨"}</div>
            </div>
            {expanded.color && (
              <div className="filter-content">
                <div className="color-buttons-container">
                  {Object.entries({
                    red: "Red",
                    green: "Green",
                    White: "White",
                    Orange: "Orange",
                    Grey: "Grey",
                    black: "Black",
                    blue: "Blue",
                  }).map(([key, label]) => (
                    <button
                      key={key}
                      className={`color-button ${
                        colorFilters[key.toLowerCase()] ? "selected" : ""
                      }`}
                      style={{
                        backgroundColor: colorStyles[key],
                        border: key === "White" ? "1px solid #ccc" : "none",
                      }}
                      onClick={() => handleColorChange(key)}
                      title={label}
                    >
                      {/* {key}
                      {label} */}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default FilterComponent;
