// src/middlewares/authenticateToken.js
import jwt from 'jsonwebtoken';
import Paciente from '../models/paciente_model.js';

const authenticateToken = async (req, res, next) => {
  try {
    const { cookies } = req;
    const accessToken = cookies.token;

    if (!accessToken) {
      return res.status(401).json({
        code: -50,
        message: 'No se ha proporcionado un token de acceso'
      });
    }

    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    const paciente = await Paciente.findByPk(decodedToken.id_paciente);
    if (!paciente) {
      return res.status(401).json({
        code: -70,
        message: 'Token de acceso no válido'
      });
    }

    req.paciente = paciente;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al autenticar el token de acceso'
    });
  }
};

export default authenticateToken;