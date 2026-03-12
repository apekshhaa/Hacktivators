const authService = require('../services/auth/auth.service');

exports.login = async (req, res) => {
  try {
    const data = await authService.authenticateForm(req.body);
    res.json({ success: true, token: data.token });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};