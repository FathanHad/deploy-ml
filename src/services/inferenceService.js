const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
    console.log(image)
    try {
        const tensor = tf.node
            .decodeJpeg(image._data)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat();

            const prediction = model.predict(tensor);
            const score = await prediction.data();
    
            // Mengambil nilai probabilitas Cancer dari hasil prediksi
            const cancerProbability = score[0];

        let label, suggestion;

        // Klasifikasi berdasarkan probabilitas
        if (cancerProbability > 0.5) {
            label = 'Cancer';
            suggestion = "Segera konsultasi dengan dokter terdekat untuk diagnosis lebih lanjut.";
        } else {
            label = 'Non-cancer';
            suggestion = "Tidak terdeteksi tanda-tanda kanker, namun tetap periksa kesehatan secara berkala.";
        }

        return { label, suggestion };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`);
    }
}

module.exports = predictClassification;