'use strict'

import { getUsuarios } from "./usuarios.js"

    const usuarios = await getUsuarios()

    console.log(usuarios)
