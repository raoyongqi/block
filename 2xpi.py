
import zipfile
import os

def create_xpi(folder_path, output_path):
    # 打开一个新的 zip 文件（即 xpi 文件）
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        # 遍历文件夹中的文件
        for root, dirs, files in os.walk(folder_path):
            for file in files:
                # 获取文件的完整路径
                file_path = os.path.join(root, file)
                # 将文件添加到 zip 文件中
                # os.path.relpath 会保持文件夹结构
                zipf.write(file_path, os.path.relpath(file_path, folder_path))

    print(f"XPI 文件已生成：{output_path}")

# 设置文件夹路径和输出 XPI 文件路径
folder_path = 'domain-tracker'  # 你的扩展文件夹路径
output_path = 'domain-tracker.xpi'  # 输出的 XPI 文件路径

# 调用函数创建 XPI 文件
create_xpi(folder_path, output_path)
