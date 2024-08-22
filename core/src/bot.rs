use ollama_rs::{generation::completion::request::GenerationRequest, Ollama};
use teloxide::{prelude::Requester, types::Message, Bot};


#[tauri::command(rename_all="snake_case")]
pub async fn run_bot(token: String, model: String) {
  let bot = Bot::new(token);

  teloxide::repl(bot, move |bot: Bot, msg: Message| {
    let model = model.clone();

    async move {
      let message_text = msg.text().unwrap();

      let res = Ollama::default().generate(GenerationRequest::new(
        model, message_text.to_string(),
      )).await.unwrap();

      bot.send_message(msg.chat.id, res.response).await?;

      Ok(())
    }
  }).await;
}
