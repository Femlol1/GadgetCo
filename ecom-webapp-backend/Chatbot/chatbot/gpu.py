import tensorflow as tf

print("Num GPUs Available: ", len(tf.config.list_physical_devices('GPU')))
if not tf.config.list_physical_devices('GPU'):
    print("No GPU was detected. TensorFlow will run on CPU.")
else:
    print("TensorFlow will run on GPU.")