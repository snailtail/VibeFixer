function serialize(value) {
  return JSON.stringify(value);
}

function deserialize(value, fallback) {
  if (!value) {
    return fallback;
  }
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

module.exports = {
  serialize,
  deserialize,
};
