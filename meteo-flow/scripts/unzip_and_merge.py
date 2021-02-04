import glob
import os
import zipfile
import argparse


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Unzip & Merge IMGW Synop files")
    parser.add_argument("source", metavar="s", type=str, help="Directory with IMGW files")
    parser.add_argument("dest", metavar="d", type=str, help="Dest output file")
    args = parser.parse_args()
    
    zip_files = glob.glob(os.path.join(args.source, "*.zip"))

    with open(args.dest, "wb") as output:
        for zf_path in zip_files:
            with zipfile.ZipFile(zf_path) as zf:
                zipped_files = [ name for name in zf.namelist() if not name.startswith("s_d_t") ]
                for fname in zipped_files:
                    with zf.open(fname) as f:
                        output.write(f.read().replace(b'"', b''))

