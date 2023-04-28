import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Grid, Typography, TextField, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import useLocalStorage from "react-use-localstorage";

import { Tema } from "../../../models/Tema";

import { getId, post, put } from "../../../service/Service";

import "./CadastroTema.css";

function CadastroTema() {

  const history = useNavigate();

  const [token, setToken] = useLocalStorage("token");

  const { id } = useParams<{ id: string }>();

  const [tema, setTema] = useState<Tema>({
    id: 0,
    tituloTema: "",
    descricao: "",
  });

  function updateModel(event: ChangeEvent<HTMLInputElement>) {
    setTema({
      ...tema,
      [event.target.name]: event.target.value,
    });
  }

  async function getTemaById(id: string) {
    await getId(`/temas/${id}`, setTema, {
      headers: {
        Authorization: token,
      },
    });
  }

  useEffect(() => {
    if (id !== undefined) {
      getTemaById(id);
    }
  }, []);

  useEffect(() => {
    if (token === "") {
      alert("Você precisa estar logado.");
      history("/login");
    }
  }, [token]);

  async function onSubmit(event: ChangeEvent<HTMLFormElement>) {
    event.preventDefault();

    if (id !== undefined) {
      try {
        await put("/temas", tema, setTema, {
          headers: {
            Authorization: token,
          },
        });
        alert("Tema atualizado com sucesso.");
        history("/temas");
      } catch (error) {
        alert("Erro! O tema não foi atualizado.");
      }
    } else {
      try {
        await post("/temas", tema, setTema, {
          headers: {
            Authorization: token,
          },
        });
        alert("Tema cadastrado com sucesso.");
        history("/temas");
      } catch (error) {
        alert("Erro! O tema não foi cadastrado.");
      }
    }
  }

  return (
    <>
      <Grid container justifyContent={"center"} mt={4}>
        <Grid item xs={6}>
          <Typography
            align="center"
            variant="h3"
            gutterBottom
            fontWeight={"bold"}
          >
            {/* if ternário */}
            {tema.id !== 0 ? "Editar tema" : "Cadastrar tema"}
          </Typography>
          <form onSubmit={onSubmit}>
            <Box display="flex" flexDirection={"column"} gap={2}>
            <TextField
                label="Título do tema"
                name="tituloTema"
                value={tema.tituloTema}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  updateModel(event)
                }
                id="tituloTema"
              />
              <TextField
                label="Descrição do tema"
                name="descricao"
                value={tema.descricao}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  updateModel(event)
                }
              />
              <Button
                type="submit"
                variant="contained"
                disabled={tema.descricao.length < 3}
              >
                Cadastrar
              </Button>
            </Box>
          </form>
        </Grid>
      </Grid>
    </>
  );
}

export default CadastroTema;